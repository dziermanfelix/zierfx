# Scripts

This directory contains utility scripts for managing the application.

## Admin User Management

### `ensure-admin.ts`

Ensures an admin user exists in the database. This script will create a new admin user if one doesn't exist, or update the password if the user already exists.

**Usage:**

**Option 1: Using npm script**

```bash
# Using environment variables directly
DATABASE_URL='postgresql://...' ADMIN_USER='admin' ADMIN_PASS='password' npm run ensure-admin

# Or set in .env file and run
npm run ensure-admin

# For production (example)
DATABASE_URL='your-production-db-url' ADMIN_USER='admin' ADMIN_PASS='securepassword' npm run ensure-admin
```

**Option 2: Using shell script (recommended for production)**

```bash
# Set PROD_DATABASE_URL, ADMIN_USER, and ADMIN_PASS in .env.local, then run:
./scripts/ensure-admin.sh

# Or provide environment variables directly:
PROD_DATABASE_URL='postgresql://...' ADMIN_USER='admin' ADMIN_PASS='password' ./scripts/ensure-admin.sh
```

**Environment Variables:**

- `DATABASE_URL` - PostgreSQL connection string (required, or uses default from .env)
- `ADMIN_USER` - Admin username (required)
- `ADMIN_PASS` - Admin password (required)
- `ADMIN_EMAIL` - Admin email (optional, defaults to `{username}@admin.local`)

**Features:**

- ✅ Creates admin user if it doesn't exist
- ✅ Updates password if it has changed
- ✅ Ensures role is set to 'admin'
- ✅ Safe to run multiple times (idempotent)

## Database Backup & Restore

See [backup/README.md](./backup/README.md) for database backup and restore scripts.
