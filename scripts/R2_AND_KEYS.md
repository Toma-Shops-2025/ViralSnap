# AlgoRhythm — egress fixes & Supabase keys (copy/paste)

Project: **AlgoRhythm-Production** (`tmpdjywsnwzivetqludd`)  
Site: **https://myalgorhythm.online** (Netlify)

---

## 1) Add `SUPABASE_SERVICE_ROLE_KEY` on Netlify (required for server features)

The service role key is **secret** — never put it in the browser, GitHub, or a public file.

### Step A — Copy the key from Supabase

1. Open: https://supabase.com/dashboard/project/tmpdjywsnwzivetqludd/settings/api  
2. Under **Project API keys**, find **`service_role`** (labeled *secret*).  
3. Click **Reveal**, then **Copy**.  
   - It starts with `eyJ` and is a long JWT string.

### Step B — Paste into Netlify

1. Open your AlgoRhythm site in Netlify → **Site configuration** → **Environment variables**.  
2. Click **Add a variable** → **Add a single variable**.  
3. Fill in:

| Field | Value |
|--------|--------|
| **Key** | `SUPABASE_SERVICE_ROLE_KEY` |
| **Value** | *(paste the key you copied — nothing else)* |
| **Scopes** | All scopes (or at least **Functions** + **Builds**) |

4. **Save**, then **Trigger deploy** → **Deploy site** (so server functions pick up the new key).

### Also confirm these Netlify vars exist

| Key | Example / where to get it |
|-----|---------------------------|
| `SUPABASE_URL` | `https://tmpdjywsnwzivetqludd.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API → **anon** `public` key |
| `VITE_SUPABASE_URL` | Same URL as above |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same anon key as above |

---

## 2) Run the egress audit on your PC (optional)

Paste into **PowerShell** (replace the two `PASTE_...` parts with keys from Supabase → Settings → API):

```powershell
$env:SUPABASE_URL = "https://tmpdjywsnwzivetqludd.supabase.co"
$env:SUPABASE_ANON_KEY = "PASTE_ANON_PUBLIC_KEY_HERE"
$env:SUPABASE_SERVICE_ROLE_KEY = "PASTE_SERVICE_ROLE_KEY_HERE"
cd C:\Users\SexyMimi\Desktop\algorhythm
node scripts/audit-egress.mjs
```

`SUPABASE_SERVICE_ROLE_KEY` is optional for the script but helps list exact storage file sizes.

---

## 3) Find huge videos in Supabase SQL Editor

Run `scripts/audit-egress.sql` in Supabase → **SQL Editor**, or just the “largest files” section at the bottom.

Posts over **25 MB** should be re-compressed (HandBrake, [videocompress.ai](https://videocompress.ai)) and re-uploaded, or unpublished until fixed.

---

## 4) What we changed in the app (egress savings)

- **Feed**: only the visible post loads video/audio (`preload="none"` for off-screen items).  
- **Discover**: no longer mounts hidden `<video>` elements for thumbnails.  
- **Post page**: `preload="metadata"` instead of `auto`.  
- **Upload**: new videos capped at **25 MB** (audio still up to 50 MB).

These changes cut repeat downloads; your two existing **~48 MB** videos are still the biggest cost until you replace them.

---

## ViralSnap (separate project)

If you also need the service role key for **ViralSnap**:

- Supabase project: `ylfrcrigmazlptxnlzqm`  
- Same steps: Settings → API → **service_role** → Reveal → copy  
- Netlify (viralsnap.online): add `SUPABASE_SERVICE_ROLE_KEY` with that project’s key  

Each Supabase project has its **own** service role key — do not mix them.

---

## 5) Cloudflare R2 (media hosting — kills Supabase egress bills)

Posts/auth stay on **free Supabase**. Audio/video files go to **Cloudflare R2** (no egress fees).

### Create bucket + API token (once)

1. https://dash.cloudflare.com → **R2 Object Storage** → **Create bucket**  
   - Name: `toma-media` (or anything; use the same name in env)
2. Open the bucket → **Settings** → **Public access** → allow public bucket / connect **R2.dev** subdomain  
   - Copy the public URL, e.g. `https://pub-xxxxxxxx.r2.dev`
3. R2 → **Manage R2 API Tokens** → **Create API token**  
   - Permission: Object Read & Write  
   - Apply to `toma-media`  
   - Copy **Access Key ID**, **Secret Access Key**, and note your **Account ID**

### CORS (required for browser uploads)

Bucket → **Settings** → **CORS policy** → paste:

```json
[
  {
    "AllowedOrigins": [
      "https://myalgorhythm.online",
      "https://viralsnap.online",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### Netlify env vars (both sites)

| Key | Value |
|-----|--------|
| `R2_ACCOUNT_ID` | Cloudflare account id |
| `R2_ACCESS_KEY_ID` | from API token |
| `R2_SECRET_ACCESS_KEY` | from API token |
| `R2_BUCKET` | `toma-media` |
| `R2_PUBLIC_URL` | `https://pub-xxxxxxxx.r2.dev` (no trailing slash) |

Redeploy both Netlify sites after saving.

### Migrate existing files off Supabase Storage

```powershell
# AlgoRhythm
$env:APP="algorhythm"
$env:SUPABASE_URL="https://tmpdjywsnwzivetqludd.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="..."
$env:R2_ACCOUNT_ID="..."
$env:R2_ACCESS_KEY_ID="..."
$env:R2_SECRET_ACCESS_KEY="..."
$env:R2_BUCKET="toma-media"
$env:R2_PUBLIC_URL="https://pub-xxxxxxxx.r2.dev"
cd C:\Users\SexyMimi\Desktop\algorhythm
node scripts/migrate-media-to-r2.mjs --dry-run
node scripts/migrate-media-to-r2.mjs

# ViralSnap — same R2_* vars, different Supabase
$env:APP="viralsnap"
$env:SUPABASE_URL="https://ylfrcrigmazlptxnlzqm.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="(ViralSnap service role)"
cd C:\Users\SexyMimi\Desktop\viralsnap
node scripts/migrate-media-to-r2.mjs --dry-run
node scripts/migrate-media-to-r2.mjs
```

After migration + a week of healthy feeds, you can empty the old Supabase Storage buckets so egress stops.
