#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/apps/web"
echo "Installing..."
npm install --silent
echo "Building..."
npm run build --silent
echo "Deploying to Vercel..."
npx vercel --prod --yes
