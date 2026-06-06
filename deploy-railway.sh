#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "Installing dependencies..."
cd apps/web && npm install --silent && cd ../..
echo "Pushing to Railway..."
railway init --yes || true
railway up
