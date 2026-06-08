# Mux Video Streaming Integration

You have Mux tokens ready, so the goal is to move video delivery onto Mux for smooth adaptive (HLS) playback that scales to thousands of posts. The player is already HLS-ready and falls back to MP4, so existing Supabase-stored videos keep working — new uploads go straight to Mux.

## How it will work

```text
Upload page
  1. Insert video row (status: processing)
  2. Ask server for a Mux direct-upload URL (linked to that row)
  3. Browser uploads the file directly to Mux (no Supabase storage)
        |
        v
Mux encodes the video (adaptive bitrate + thumbnail)
        |
        v
Mux webhook -> our endpoint
  - asset ready  -> save playback id, mark video published
  - asset errored -> mark video errored
        |
        v
Feed serves the Mux HLS stream; player streams adaptively, no stutter
```

## What gets built

### 1. Database (migration)
Add Mux tracking columns to the `videos` table:
- `mux_upload_id`, `mux_asset_id`, `mux_playback_id`, `mux_asset_status`
- Make `media_url` nullable (Mux uploads have no storage URL; MP4 fallback still works for old videos)
- Add a `processing` value to the video status type so in-progress uploads stay out of the feed until Mux finishes

### 2. Mux server helper (`src/lib/mux.server.ts`)
- Authenticated calls to the Mux API using `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET`
- Create a direct upload (public playback policy, links the row id via Mux passthrough)
- Verify incoming webhook signatures with the Mux signing secret

### 3. Server function (`src/lib/mux.functions.ts`)
- `createMuxDirectUpload` (auth-protected): creates the Mux upload, stores `mux_upload_id` on the row, returns the one-time upload URL to the browser

### 4. Webhook endpoint (`src/routes/api/public/mux/webhook.ts`)
- Verifies the Mux signature, then on `video.asset.ready` saves `mux_playback_id` + marks the video `published`; on `video.asset.errored` marks it `errored`

### 5. Upload page (`src/routes/upload.tsx`)
- Replace the Supabase storage upload with: insert row → get Mux upload URL → upload file to Mux
- Show a short "processing — your video will go live in a moment" confirmation since Mux encodes asynchronously

### 6. Player/feed (minor)
- Already HLS-ready via `src/lib/video.ts`; confirm Mux playback IDs and poster thumbnails resolve correctly

## What I need from you
1. I'll request three secrets when we start building: `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`, and `MUX_WEBHOOK_SIGNING_SECRET`.
2. The webhook signing secret comes from the Mux dashboard *after* I give you the webhook URL — so the order is: build the endpoint → you add the webhook URL in Mux → paste the signing secret back here.

## Notes
- Direct-to-Mux upload avoids double-storing files (no Supabase video storage cost) and is the scalable path for thousands of posts.
- Existing videos already in Supabase storage continue to play via the MP4 fallback already in the player.
