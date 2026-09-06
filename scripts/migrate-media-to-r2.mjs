/**
 * Migrate published media from Supabase Storage → Cloudflare R2, then rewrite DB URLs.
 *
 * Shared bucket layout:
 *   algorhythm/media|covers/...
 *   viralsnap/videos|covers/...
 *
 * Usage (PowerShell) — AlgoRhythm:
 *   $env:APP="algorhythm"
 *   $env:SUPABASE_URL="https://tmpdjywsnwzivetqludd.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY="..."
 *   $env:R2_ACCOUNT_ID="..."
 *   $env:R2_ACCESS_KEY_ID="..."
 *   $env:R2_SECRET_ACCESS_KEY="..."
 *   $env:R2_BUCKET="toma-media"
 *   $env:R2_PUBLIC_URL="https://pub-xxxxx.r2.dev"
 *   node scripts/migrate-media-to-r2.mjs [--dry-run] [--limit=N]
 *
 * ViralSnap: set APP=viralsnap and that project's SUPABASE_URL / service role.
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";

const APP = (process.env.APP || "algorhythm").toLowerCase();
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET = process.env.R2_BUCKET || "";
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

const CONFIG =
  APP === "viralsnap"
    ? {
        table: "videos",
        mediaCol: "media_url",
        coverCol: "cover_url",
        mediaKind: "videos",
        coverKind: "covers",
        prefix: "viralsnap",
        filter: "status=eq.published",
      }
    : {
        table: "posts",
        mediaCol: "media_url",
        coverCol: "cover_url",
        mediaKind: "media",
        coverKind: "covers",
        prefix: "algorhythm",
        filter: "is_published=eq.true",
      };

if (!SUPABASE_URL || !SERVICE_KEY || !R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
  console.error("Missing required env vars. See script header.");
  process.exit(1);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

function alreadyOnR2(url) {
  return Boolean(url && (url.startsWith(R2_PUBLIC_URL) || url.includes(`/${CONFIG.prefix}/`)));
}

function extFromUrl(url, fallback) {
  try {
    const path = new URL(url).pathname;
    const m = path.match(/\.([a-z0-9]+)$/i);
    return (m?.[1] || fallback).toLowerCase();
  } catch {
    return fallback;
  }
}

async function rest(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`REST ${res.status}: ${await res.text()}`);
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  return { buf, contentType };
}

async function uploadR2(key, buf, contentType) {
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buf,
      ContentType: contentType,
    }),
  );
  return `${R2_PUBLIC_URL}/${key}`;
}

async function migrateUrl(id, creatorId, kind, url, fallbackExt) {
  if (!url || alreadyOnR2(url)) return { skipped: true, url };
  const { buf, contentType } = await download(url);
  const hash = createHash("sha1").update(buf).digest("hex").slice(0, 12);
  const ext = extFromUrl(url, fallbackExt);
  const key = `${CONFIG.prefix}/${kind}/${creatorId || "unknown"}/${id}-${kind}-${hash}.${ext}`;
  if (DRY_RUN) {
    console.log(`WOULD ${kind} ${id} -> ${key} (${(buf.length / 1024 / 1024).toFixed(1)}MB)`);
    return { skipped: false, url: `${R2_PUBLIC_URL}/${key}` };
  }
  const publicUrl = await uploadR2(key, buf, contentType);
  console.log(`OK ${kind} ${id} -> ${publicUrl}`);
  return { skipped: false, url: publicUrl };
}

async function main() {
  console.log(`APP=${APP} dry=${DRY_RUN} limit=${Number.isFinite(LIMIT) ? LIMIT : "all"}`);
  const rows = await rest(
    `${CONFIG.table}?select=id,creator_id,${CONFIG.mediaCol},${CONFIG.coverCol}&${CONFIG.filter}&order=created_at.asc`,
  );
  console.log(`Rows: ${rows.length}`);

  let done = 0;
  let migrated = 0;
  let errors = 0;

  for (const row of rows) {
    if (done >= LIMIT) break;
    done++;
    try {
      const media = await migrateUrl(row.id, row.creator_id, CONFIG.mediaKind, row[CONFIG.mediaCol], APP === "viralsnap" ? "mp4" : "bin");
      const cover = await migrateUrl(row.id, row.creator_id, CONFIG.coverKind, row[CONFIG.coverCol], "jpg");

      const patch = {};
      if (!media.skipped) patch[CONFIG.mediaCol] = media.url;
      if (!cover.skipped && row[CONFIG.coverCol]) patch[CONFIG.coverCol] = cover.url;

      if (Object.keys(patch).length && !DRY_RUN) {
        await rest(`${CONFIG.table}?id=eq.${row.id}`, {
          method: "PATCH",
          body: JSON.stringify(patch),
        });
        migrated++;
      } else if (Object.keys(patch).length && DRY_RUN) {
        migrated++;
      }
    } catch (e) {
      errors++;
      console.error(`ERROR ${row.id}: ${e.message}`);
    }
  }

  console.log({ done, migrated, errors });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
