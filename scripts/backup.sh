#!/bin/sh
set -eu

: "${POSTGRES_HOST:?POSTGRES_HOST is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"

backup_dir="${BACKUP_DIR:-/backups}"
retention_days="${BACKUP_RETENTION_DAYS:-14}"
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
destination="$backup_dir/${POSTGRES_DB}_${timestamp}.dump"
mkdir -p "$backup_dir"

pg_dump --host="$POSTGRES_HOST" --username="$POSTGRES_USER" \
  --dbname="$POSTGRES_DB" --format=custom --compress=9 \
  --no-owner --no-acl --file="$destination"
pg_restore --list "$destination" >/dev/null
sha256sum "$destination" >"$destination.sha256"
find "$backup_dir" -type f -name "${POSTGRES_DB}_*.dump*" -mtime "+$retention_days" -delete
echo "$destination"
