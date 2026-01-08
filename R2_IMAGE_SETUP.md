# Cloudflare R2 Image Storage Setup

## Step 1: Create R2 Bucket

```bash
wrangler r2 bucket create businessdiary-images
```

## Step 2: Add image_url column to database

```bash
wrangler d1 execute businessdiarydb --remote --file=add_image_column.sql
```

## Step 3: Deploy Worker with R2 Binding

```bash
wrangler deploy
```

## Step 4: Test Image Upload

```bash
# Upload an image
curl -X POST https://businessdiary-api.tejasborade9594.workers.dev/api/businesses/upload-image \
  -F "image=@path/to/image.jpg"

# Response will contain imageUrl like: /images/business-1234567890.jpg
```

## Image URLs

Images will be accessible at:
```
https://businessdiary-api.tejasborade9594.workers.dev/images/business-1234567890.jpg
```

## Cost

R2 Storage:
- **Storage:** 10 GB free, then $0.015/GB/month
- **Class A operations (write):** 1 million free, then $4.50/million
- **Class B operations (read):** 10 million free, then $0.36/million
- **Egress:** **FREE** (unlimited!)

For 30K users with 1000 businesses:
- Storage: ~1-2 GB = **FREE**
- Reads: ~100K/month = **FREE**
- Writes: ~1K/month = **FREE**
- **Total: $0/month**

## Frontend Integration

Images are automatically served from the Worker at `/images/filename`.

The full URL will be:
`https://businessdiary-api.tejasborade9594.workers.dev/images/business-123.jpg`
