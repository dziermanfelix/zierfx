# Database Backup

Simple script to backup production DB and restore it locally.

## Usage

Add these to your `.env.local` (or `.env`):

```bash
BACKUP_PROD_DB_URL='your-production-postgres-url'
BACKUP_DEV_DB_URL='postgresql://user@localhost:5432/your_local_db'
```

Then run the script:

```bash
./scripts/backup/backup-and-restore.sh
```

Backups are saved to `scripts/backup/backups/` with timestamps.
