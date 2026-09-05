#!/usr/bin/env bash
set -eo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups/db}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/lohakit_db_${TIMESTAMP}.sql.gz"

DB_CONTAINER="${DB_CONTAINER:-chiotron_postgres}"
DB_USER="${DB_USER:-lohakit_admin}"
DB_NAME="${DB_NAME:-lohakit_cms}"

mkdir -p "${BACKUP_DIR}"

echo "Starting database backup for ${DB_NAME} at ${TIMESTAMP}..."
docker exec -t "${DB_CONTAINER}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists | gzip > "${BACKUP_FILE}"

echo "Database backup completed successfully: ${BACKUP_FILE} ($(du -sh "${BACKUP_FILE}" | cut -f1))"

# Keep last 14 days of backups
find "${BACKUP_DIR}" -type f -name "lohakit_db_*.sql.gz" -mtime +14 -exec rm {} \;
echo "Pruned backups older than 14 days."
