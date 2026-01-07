# Deploy to Cloudflare Pages
Write-Host "Building React app..." -ForegroundColor Green
Set-Location frontend
npm install
npm run build
Set-Location ..

Write-Host "Deploying to Cloudflare..." -ForegroundColor Green
wrangler pages deploy frontend/build --project-name=businessdiary-frontend

Write-Host "Deployment complete!" -ForegroundColor Green
