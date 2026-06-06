#!/usr/bin/env bash
set -euo pipefail
if ! command -v vercel >/dev/null 2>&1; then npm i -g vercel; fi
vercel --prod
