// Server-only Mux helper. Talks to the Mux Video API using the access token
// credentials and verifies incoming webhook signatures. Never import from
// client code — this reads secret env vars.
import process from "node:process";

const MUX_API_BASE = "https://api.mux.com";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
}

function authHeader(): string {
  const id = getEnv("MUX_TOKEN_ID");
  const secret = getEnv("MUX_TOKEN_SECRET");
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
}

export type MuxDirectUpload = {
  uploadId: string;
  uploadUrl: string;
};

/**
 * Creates a Mux direct-upload. The browser PUTs the raw video file to the
 * returned `uploadUrl`. `passthrough` lets us map the resulting asset back to
 * our own video row when the webhook fires.
 */
export async function createDirectUpload(options: {
  passthrough: string;
  corsOrigin: string;
}): Promise<MuxDirectUpload> {
  const res = await fetch(`${MUX_API_BASE}/video/v1/uploads`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cors_origin: options.corsOrigin,
      new_asset_settings: {
        playback_policy: ["public"],
        passthrough: options.passthrough,
        video_quality: "basic",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mux upload create failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { data: { id: string; url: string } };
  return { uploadId: json.data.id, uploadUrl: json.data.url };
}

export type MuxReconciled = {
  assetId: string | null;
  assetStatus: string | null;
  playbackId: string | null;
};

async function muxGet(path: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${MUX_API_BASE}${path}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: Record<string, unknown> };
  return json.data ?? null;
}

/**
 * Looks up the current Mux state for a given upload id by resolving the upload
 * to its asset and reading the asset's status + public playback id. This is the
 * webhook-independent path used to publish a video as soon as Mux is done,
 * even if the dashboard webhook was never configured.
 */
export async function reconcileUpload(uploadId: string): Promise<MuxReconciled> {
  const upload = await muxGet(`/video/v1/uploads/${uploadId}`);
  const assetId = (upload?.asset_id as string | undefined) ?? null;
  if (!assetId) return { assetId: null, assetStatus: null, playbackId: null };

  const asset = await muxGet(`/video/v1/assets/${assetId}`);
  const assetStatus = (asset?.status as string | undefined) ?? null;
  const playbackIds = (asset?.playback_ids as { id: string; policy: string }[] | undefined) ?? [];
  const playbackId =
    playbackIds.find((p) => p.policy === "public")?.id ?? playbackIds[0]?.id ?? null;

  return { assetId, assetStatus, playbackId };
}

/**
 * Verifies a Mux webhook signature. Mux sends a `Mux-Signature` header of the
 * form `t=<timestamp>,v1=<hex hmac>` where the HMAC is SHA-256 of
 * `${timestamp}.${rawBody}` keyed by the webhook signing secret.
 */
export async function verifyMuxSignature(rawBody: string, header: string | null): Promise<boolean> {
  if (!header) return false;
  const secret = getEnv("MUX_WEBHOOK_SIGNING_SECRET");

  let timestamp: string | undefined;
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) return false;

  // Reject signatures older than 5 minutes to limit replay.
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (Number.isNaN(age) || age > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`),
  );
  const expected = Buffer.from(new Uint8Array(signed)).toString("hex");
  return signatures.includes(expected);
}
