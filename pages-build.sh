#!/bin/bash
# Cloudflare Pages build script

echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Building React app..."
npm run build

echo "Build complete!"
