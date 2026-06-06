#!/usr/bin/env bash
set -euo pipefail
if ! command -v netlify >/dev/null 2>&1; then npm i -g netlify-cli; fi
netlify deploy --prod
