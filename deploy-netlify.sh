#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/apps/web"
echo "Building for export..."
npm run build --silent
echo "Deploying to Netlify..."
netlify deploy --prod --dir=.next/standalone
