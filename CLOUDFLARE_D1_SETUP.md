# Cloudflare D1 Database Setup Guide

## Prerequisites
- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- Logged into Wrangler (`wrangler login`)

## Step 1: Create D1 Database

```bash
cd worker-backend
wrangler d1 create businessdiarydb
```

This will output something like:
```
✅ Successfully created DB 'businessdiarydb'
database_id = "abc123-def456-ghi789"
```

Copy the `database_id` and update `worker-backend/wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "businessdiarydb"
database_id = "abc123-def456-ghi789"  # <-- Paste your database_id here
```

## Step 2: Initialize Database Schema

```bash
wrangler d1 execute businessdiarydb --file=schema.sql
```

## Step 3: Seed Sample Data (Optional)

Create `seed.sql`:
```sql
-- Insert sample super admin
INSERT INTO users (email, password, full_name, role) VALUES 
('admin@businessdiary.com', '$2a$10$YourHashedPasswordHere', 'Super Admin', 'super_admin');

-- Insert sample categories
INSERT INTO categories (name, description, icon) VALUES
('Restaurants', 'Food and dining', '🍽️'),
('Healthcare', 'Medical services', '🏥'),
('Education', 'Schools and training', '📚'),
('Shopping', 'Retail stores', '🛒');

-- Insert sample areas
INSERT INTO areas (name, city, state, pincode) VALUES
('Andheri', 'Mumbai', 'Maharashtra', '400058'),
('Koramangala', 'Bangalore', 'Karnataka', '560034'),
('Connaught Place', 'Delhi', 'Delhi', '110001');
```

Run seed:
```bash
wrangler d1 execute businessdiarydb --file=seed.sql
```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Test Locally

```bash
npm run dev
```

Test API:
```bash
curl http://localhost:8787/api/categories
```

## Step 6: Deploy Worker

```bash
npm run deploy
```

Your API will be available at:
`https://businessdiary-api.[your-subdomain].workers.dev`

## Step 7: Update Frontend API URL

Update Cloudflare Pages environment variable:
- Go to https://dash.cloudflare.com
- Workers & Pages → businessdiaryreact
- Settings → Environment variables
- Update `REACT_APP_API_URL` to your worker URL

## Step 8: Query Database (for debugging)

```bash
# List all tables
wrangler d1 execute businessdiarydb --command "SELECT name FROM sqlite_master WHERE type='table'"

# Query users
wrangler d1 execute businessdiarydb --command "SELECT * FROM users"

# Query businesses
wrangler d1 execute businessdiarydb --command "SELECT * FROM businesses LIMIT 10"
```

## Database Management

### Backup Database
```bash
wrangler d1 export businessdiarydb --output=backup.sql
```

### Restore Database
```bash
wrangler d1 execute businessdiarydb --file=backup.sql
```

### Reset Database
```bash
wrangler d1 execute businessdiarydb --command "DROP TABLE IF EXISTS users"
wrangler d1 execute businessdiarydb --file=schema.sql
```

## Monitoring

- View logs: `wrangler tail businessdiary-api`
- View analytics: https://dash.cloudflare.com → Workers & Pages → businessdiary-api

## Cost

- **D1 Database**: 5GB storage free, then $0.50/GB
- **Worker Requests**: 100,000 requests/day free
- **Perfect for 30K users!**
