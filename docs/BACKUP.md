# Backup & Disaster Recovery Guide

## 1. Automated Cron Backups

Add the following to root crontab (`crontab -e`):

```cron
# Daily Database Backup at 02:00 AM
0 2 * * * /opt/lohakit/scripts/backup_db.sh >> /var/log/lohakit_backup.log 2>&1

# Daily Media Files Backup at 03:00 AM
0 3 * * * /opt/lohakit/scripts/backup_media.sh >> /var/log/lohakit_backup.log 2>&1
```

---

## 2. Manual Backup Execution

### Database Backup
```bash
bash scripts/backup_db.sh
```
Creates: `backups/db/lohakit_db_YYYYMMDD_HHMMSS.sql.gz`

### Media Backup
```bash
bash scripts/backup_media.sh
```
Creates: `backups/media/lohakit_media_YYYYMMDD_HHMMSS.tar.gz`

---

## 3. Disaster Recovery / Restoration

```bash
bash scripts/restore_db.sh backups/db/lohakit_db_20260902_020000.sql.gz
```
