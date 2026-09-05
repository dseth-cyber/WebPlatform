#!/usr/bin/env bash
set -eo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups/media}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/lohakit_media_${TIMESTAMP}.tar.gz"

SOURCE_DIR="./storage/uploads"
MINIO_CONTAINER="${MINIO_CONTAINER:-chiotron_minio}"

mkdir -p "${BACKUP_DIR}"

echo "Starting media backup at ${TIMESTAMP}..."

if [ -d "${SOURCE_DIR}" ]; then
    tar -czf "${BACKUP_FILE}" -C "${SOURCE_DIR}" .
    echo "Local media files backed up: ${BACKUP_FILE}"
else
    docker exec -t "${MINIO_CONTAINER}" tar -czf - /data/lohakit-media > "${BACKUP_FILE}"
    echo "MinIO media files backed up: ${BACKUP_FILE}"
fi

echo "Media backup completed successfully: ${BACKUP_FILE} ($(du -sh "${BACKUP_FILE}" | cut -f1))"
