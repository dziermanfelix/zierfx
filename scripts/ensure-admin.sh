#!/bin/bash

# Simple wrapper script to ensure admin user exists in production DB
# 
# Usage:
#   1. Set PROD_DATABASE_URL, ADMIN_USER, and ADMIN_PASS in your .env.local
#   2. Run: ./scripts/ensure-admin.sh
#
# Or provide them as environment variables:
#   DATABASE_URL=<url> ADMIN_USER=<user> ADMIN_PASS=<pass> ./scripts/ensure-admin.sh

set -e

# Get directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables from .env files if they exist
if [ -f "$PROJECT_ROOT/.env.local" ]; then
    echo "📂 Loading .env.local..."
    export $(grep -v '^#' "$PROJECT_ROOT/.env.local" | grep -E '^(ADMIN_|DATABASE_URL|PROD_DATABASE_URL)' | xargs)
elif [ -f "$PROJECT_ROOT/.env" ]; then
    echo "📂 Loading .env..."
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | grep -E '^(ADMIN_|DATABASE_URL|PROD_DATABASE_URL)' | xargs)
fi

# If PROD_DATABASE_URL is set, use it instead of DATABASE_URL
if [ ! -z "$PROD_DATABASE_URL" ]; then
    export DATABASE_URL="$PROD_DATABASE_URL"
fi

echo "🔐 Admin User Setup Script"
echo "=========================="
echo ""

# Check environment variables
if [ -z "$ADMIN_USER" ]; then
    echo "❌ Error: ADMIN_USER not set"
    echo ""
    echo "Set it with:"
    echo "  export ADMIN_USER='your_admin_username'"
    echo ""
    echo "Or add it to your .env.local file:"
    echo "  ADMIN_USER=your_admin_username"
    exit 1
fi

if [ -z "$ADMIN_PASS" ]; then
    echo "❌ Error: ADMIN_PASS not set"
    echo ""
    echo "Set it with:"
    echo "  export ADMIN_PASS='your_admin_password'"
    echo ""
    echo "Or add it to your .env.local file:"
    echo "  ADMIN_PASS=your_admin_password"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not set"
    echo ""
    echo "For production, set PROD_DATABASE_URL in .env.local:"
    echo "  PROD_DATABASE_URL=postgresql://..."
    echo ""
    echo "Or export it directly:"
    echo "  export DATABASE_URL='postgresql://...'"
    exit 1
fi

# Show what we're about to do
echo "📋 Configuration:"
echo "   Admin User: $ADMIN_USER"
echo "   Database: ${DATABASE_URL:0:50}..." # Show first 50 chars only
echo ""

# Run the TypeScript script
cd "$PROJECT_ROOT"
npm run ensure-admin

echo ""
echo "✨ Script completed!"


