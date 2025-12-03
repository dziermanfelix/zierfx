#!/bin/bash

# Simple script to backup production DB and restore to local
# 
# Usage:
#   Add BACKUP_PROD_DB_URL and BACKUP_DEV_DB_URL to your .env.local file
#   Then run: ./backup-and-restore.sh

set -e

# Get directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="$SCRIPT_DIR/backups"
mkdir -p "$BACKUP_DIR"

# Load environment variables from .env files
if [ -f "$PROJECT_ROOT/.env.local" ]; then
    echo "Loading .env.local..."
    export $(grep -v '^#' "$PROJECT_ROOT/.env.local" | grep -E '^BACKUP_' | xargs)
elif [ -f "$PROJECT_ROOT/.env" ]; then
    echo "Loading .env..."
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | grep -E '^BACKUP_' | xargs)
fi

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/prod_backup_${TIMESTAMP}.sql"

echo "Database Backup & Restore"
echo "============================="
echo ""

# Check environment variables
if [ -z "$BACKUP_PROD_DB_URL" ]; then
    echo "Error: BACKUP_PROD_DB_URL not set"
    echo ""
    echo "Set it with:"
    echo "  export BACKUP_PROD_DB_URL='your-production-database-url'"
    exit 1
fi

if [ -z "$BACKUP_DEV_DB_URL" ]; then
    echo "Error: BACKUP_DEV_DB_URL not set"
    echo ""
    echo "Set it with:"
    echo "  export BACKUP_DEV_DB_URL='postgresql://user@localhost:5432/your_local_db'"
    exit 1
fi

# Step 1: Full backup of production
echo "Step 1: Backing up production database (full backup)..."
pg_dump "$BACKUP_PROD_DB_URL" --schema=public --no-owner --no-privileges > "$BACKUP_FILE"
echo "Backup saved to: $BACKUP_FILE"

# Step 2: Restore to local
echo ""
echo "Step 2: This will DROP your local database and restore from production!"
echo "Press Enter to continue or Ctrl+C to cancel..."
read

echo ""
echo "Step 3: Restoring to local database..."
cd "$PROJECT_ROOT"

# Extract database name from URL
DB_NAME=$(echo "$BACKUP_DEV_DB_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')

# Terminate connections and drop/recreate database
echo "Dropping and recreating database: $DB_NAME"
psql -U $USER -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" > /dev/null 2>&1
dropdb -U $USER --if-exists "$DB_NAME"
createdb -U $USER "$DB_NAME"

# Restore full backup (schema + data)
echo "Restoring full backup (schema + data)..."
psql -U $USER -d "$DB_NAME" < "$BACKUP_FILE" 2>&1 | grep -v "ERROR.*unrecognized configuration parameter" | grep -v "ERROR.*role.*does not exist" || true

# Grant permissions to the database user
echo "Granting permissions..."
DB_USER=$(echo "$BACKUP_DEV_DB_URL" | sed -n 's|postgresql://\([^:]*\):.*|\1|p')
psql -U $USER -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;" > /dev/null
psql -U $USER -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;" > /dev/null

echo ""
echo "Done! Production data restored to local database."
echo "Backup saved at: $BACKUP_FILE"

