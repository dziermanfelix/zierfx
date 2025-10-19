# Production Deployment Guide

This guide covers common deployment scenarios for the admin user management script.

## Quick Start

For a typical production deployment:

```bash
# 1. Run database migrations
DATABASE_URL='your-prod-url' npm run migrate-deploy

# 2. Ensure admin user exists
DATABASE_URL='your-prod-url' ADMIN_USER='admin' ADMIN_PASS='secure-password' npm run ensure-admin
```

## Deployment Scenarios

### 1. First-Time Production Setup

When deploying to production for the first time:

```bash
# Set your production credentials
export DATABASE_URL='postgresql://user:pass@host:5432/dbname'
export ADMIN_USER='your_admin'
export ADMIN_PASS='your_secure_password'
export ADMIN_EMAIL='admin@yourdomain.com'

# Run migrations
npm run migrate-deploy

# Create admin user
npm run ensure-admin
```

### 2. Password Rotation

To rotate/update the admin password in production:

```bash
# Update to new password
DATABASE_URL='prod-url' ADMIN_USER='admin' ADMIN_PASS='new_password' npm run ensure-admin
```

The script will detect the password change and update it automatically.

### 3. Using Environment Variables from File

Create a `.env.production` file:

```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ADMIN_USER=admin
ADMIN_PASS=secure_password_here
ADMIN_EMAIL=admin@yourdomain.com
```

Then run:

```bash
# Load env file and run
source .env.production && npm run ensure-admin
```

### 4. CI/CD Pipeline Integration

#### GitHub Actions Example

```yaml
- name: Setup Admin User
  run: npm run ensure-admin
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    ADMIN_USER: ${{ secrets.ADMIN_USER }}
    ADMIN_PASS: ${{ secrets.ADMIN_PASS }}
```

#### GitLab CI Example

```yaml
deploy:
  script:
    - npm run migrate-deploy
    - npm run ensure-admin
  variables:
    DATABASE_URL: $DATABASE_URL
    ADMIN_USER: $ADMIN_USER
    ADMIN_PASS: $ADMIN_PASS
```

### 5. Using with Docker

In your Dockerfile or docker-compose:

```dockerfile
# In Dockerfile
ENV ADMIN_USER=admin
ENV ADMIN_PASS=changeme

# Run after migrations in entrypoint
RUN npm run ensure-admin
```

Or with docker-compose:

```yaml
services:
  app:
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - ADMIN_USER=${ADMIN_USER}
      - ADMIN_PASS=${ADMIN_PASS}
    command: >
      sh -c "npm run migrate-deploy &&
             npm run ensure-admin &&
             npm start"
```

### 6. Vercel/Netlify Deployment

For serverless platforms, run this after deployment:

```bash
# Using Vercel CLI with environment variables
vercel env pull .env.production
npm run ensure-admin
```

## Security Best Practices

1. **Never commit credentials**: Always use environment variables
2. **Use strong passwords**: Minimum 16 characters, mixed case, numbers, symbols
3. **Rotate regularly**: Change admin password every 90 days
4. **Use secrets management**: Store credentials in your platform's secrets manager (AWS Secrets Manager, GitHub Secrets, etc.)
5. **Audit access**: Keep logs of when the script is run

## Troubleshooting

### Connection Issues

```bash
# Test database connection first
DATABASE_URL='your-url' npx prisma db pull
```

### Permission Issues

Make sure your database user has permission to INSERT and UPDATE on the `User` table:

```sql
GRANT INSERT, UPDATE ON "User" TO your_db_user;
```

### Script Not Finding Environment Variables

Ensure variables are exported and accessible:

```bash
# Check if set
echo $ADMIN_USER
echo $DATABASE_URL

# If not, export them
export ADMIN_USER='admin'
export ADMIN_PASS='password'
```

## Integration with Existing Scripts

You can integrate this into your existing deployment workflow:

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Deploying to production..."

# 1. Run migrations
echo "📦 Running migrations..."
npm run migrate-deploy

# 2. Ensure admin exists
echo "🔐 Setting up admin user..."
npm run ensure-admin

# 3. Build and deploy
echo "🏗️  Building application..."
npm run build

echo "✅ Deployment complete!"
```

## Monitoring

Consider adding monitoring/alerting when the admin password is updated:

```typescript
// In your ensure-admin.ts, add:
if (!passwordMatch) {
  // Send notification
  await sendAlert('Admin password was updated');
}
```

## See Also

- [scripts/README.md](./README.md) - Detailed script documentation
- [../AUTH_SETUP.md](../AUTH_SETUP.md) - Authentication system overview
