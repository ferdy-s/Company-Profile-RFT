#!/usr/bin/env bash
# Jalankan di server dari root project (folder yang berisi docker-compose.yml + .env).
# Membuat semua tabel Prisma di Postgres stack Docker, lalu restart Next.js.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> prisma-setup (db push)…"
docker compose --profile tools run --rm prisma-setup

echo "==> restart native_rft_web…"
docker compose up -d --force-recreate nextjs

echo "==> selesai. Cek tabel:"
docker exec native_rft_db psql -U postgres -d rft_blog -c '\dt' | head -40
