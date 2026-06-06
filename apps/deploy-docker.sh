#!/usr/bin/env bash
set -euo pipefail
docker build -t blogforge:latest ..
docker run --rm -p 3000:3000 --env-file .env blogforge:latest
