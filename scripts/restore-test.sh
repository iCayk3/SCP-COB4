#!/bin/sh
set -eu

: "${1:?usage: restore-test.sh BACKUP.dump}"
: "${POSTGRES_HOST:?POSTGRES_HOST is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"

backup_file="$1"
[ -r "$backup_file" ] || { echo "Backup not readable: $backup_file" >&2; exit 1; }
[ -r "$backup_file.sha256" ] && sha256sum -c "$backup_file.sha256"

restore_db="restore_test_$(date -u +%Y%m%d%H%M%S)_$$"
case "$restore_db" in restore_test_*) ;; *) exit 1 ;; esac

cleanup() {
  dropdb --host="$POSTGRES_HOST" --username="$POSTGRES_USER" --if-exists "$restore_db"
}
trap cleanup EXIT INT TERM

createdb --host="$POSTGRES_HOST" --username="$POSTGRES_USER" "$restore_db"
pg_restore --host="$POSTGRES_HOST" --username="$POSTGRES_USER" \
  --dbname="$restore_db" --no-owner --no-acl --exit-on-error "$backup_file"
psql --host="$POSTGRES_HOST" --username="$POSTGRES_USER" --dbname="$restore_db" \
  --set=ON_ERROR_STOP=1 --tuples-only --command="select count(*) from flyway_schema_history;" >/dev/null
echo "Restore test completed successfully: $restore_db"
