import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/** App prefix inside the shared Toma media bucket. */
export const R2_APP_PREFIX = "viralsnap";

export type R2MediaKind = "videos" | "covers" | "avatars";

function required(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`${name} is not configured on the server`);
  return v;
}

export function r2PublicBase(): string {
  return required("R2_PUBLIC_URL").replace(/\/$/, "");
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL,
  );
}

export function isAllowedMediaUrl(url: string, kind: R2MediaKind): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;

    const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
    if (publicBase && url.startsWith(`${publicBase}/${R2_APP_PREFIX}/${kind}/`)) {
      return true;
    }

    const supabase = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
    if (supabase && url.startsWith(`${supabase}/storage/v1/object/public/${kind}/`)) {
      return true;
    }

    return u.pathname.includes(`/storage/v1/object/public/${kind}/`);
  } catch {
    return false;
  }
}

function getR2Client() {
  const accountId = required("R2_ACCOUNT_ID");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  });
}

export async function createR2PresignedUpload(opts: {
  userId: string;
  kind: R2MediaKind;
  ext: string;
  contentType: string;
}): Promise<{ key: string; uploadUrl: string; publicUrl: string }> {
  if (!isR2Configured()) {
    throw new Error(
      "Cloudflare R2 is not configured. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL on Netlify.",
    );
  }

  const ext = opts.ext.replace(/^\./, "").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const key = `${R2_APP_PREFIX}/${opts.kind}/${opts.userId}/${crypto.randomUUID()}.${ext}`;
  const bucket = required("R2_BUCKET");
  const client = getR2Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: opts.contentType || "application/octet-stream",
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 10 });
  const publicUrl = `${r2PublicBase()}/${key}`;
  return { key, uploadUrl, publicUrl };
}
