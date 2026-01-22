# Cloudflare Pages Configuration

## Build Configuration

Set these in Cloudflare Dashboard → Workers & Pages → businessdiaryreact → Settings → Builds & deployments:

### Build Settings:
- **Framework preset**: `Create React App`
- **Build command**: `cd frontend && npm install && npm run build`
- **Build output directory**: `frontend/build`
- **Root directory**: `/` (leave empty or use `/`)

### Environment Variables:
- **NODE_VERSION**: `18`

---

## Quick Fix Instructions

### Option 1: Via Cloudflare Dashboard (Recommended)

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **businessdiaryreact**
3. Click: **Settings** → **Builds & deployments**
4. Update:
   - Build command: `cd frontend && npm install && npm run build`
   - Build output directory: `frontend/build`
5. Click **Save**
6. Go to **Deployments** tab
7. Click **Retry deployment** on latest build

### Option 2: Redeploy from GitHub

1. Go to: https://dash.cloudflare.com
2. **Workers & Pages** → **businessdiaryreact** → **Deployments**
3. Find the latest deployment (commit c259ba2)
4. Click **...** (three dots) → **Retry deployment**

---

## Verify Deployment

After redeploying, check:

1. **Build logs** - Should show:
   ```
   Installing frontend dependencies...
   Building React app...
   Compiled successfully!
   ```

2. **Output** - Should be from `frontend/build/`

3. **Files deployed** - Should include:
   - `static/js/main.*.js` (with AIChat code)
   - `static/css/main.*.css` (with AIChat styles)

---

## Current Issue

Your Cloudflare Pages is likely building from the **root directory** instead of the **frontend directory**, which is why the old design persists.

The deployment is probably trying to build from `/` but your React app is in `/frontend/`.

---

## Alternative: Create wrangler.toml for Pages

If the above doesn't work, create this file in your repo root:

```toml
# wrangler.toml (for Pages)
name = "businessdiaryreact"
pages_build_output_dir = "frontend/build"

[build]
command = "cd frontend && npm install && npm run build"
cwd = ""

[build.upload]
format = "directory"
dir = "frontend/build"
```

Then redeploy.
