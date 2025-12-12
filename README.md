# Zierfx

A music library management application built with Next.js, Prisma, and Supabase.

## Features

- Upload and manage music albums with tracks
- Artist and album organization
- Audio file storage and playback
- Album artwork support
- Track metadata extraction

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Supabase account (for file storage)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Configure the following variables:

   - `DATABASE_URL`: PostgreSQL connection string
   - `SUPABASE_URL`: Supabase project URL
   - `SUPABASE_ANON_KEY`: Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
   - `SUPABASE_BUCKET`: Supabase bucket for storing albums

4. Set up the database:

   ```bash
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Run tests with:

```bash
npm test
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run migrate-dev`: Run database migrations (development)
- `npm run migrate-deploy`: Run database migrations (production)
- `npm run studio`: Open Prisma Studio
- `npm run clean`: Clean database
- `npm run seed`: Seed database with initial data
- `npm run ensure-admin`: Create or update admin user credentials
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage

## Admin User Management

To ensure an admin user exists in your database (useful for production deployments):

1. Set required environment variables in `.env.local`:

   ```bash
   ADMIN_USER='your_admin_username'
   ADMIN_PASS='your_secure_password'
   ADMIN_EMAIL='admin@yourdomain.com' # optional
   ```

2. Run the ensure-admin script:

   ```bash
   # For local database
   npm run ensure-admin

   # For production (with shell script)
   PROD_DATABASE_URL='your-prod-url' ./scripts/ensure-admin.sh
   ```

This script is idempotent and safe to run multiple times. It will:

- Create the admin user if it doesn't exist
- Update the password if it has changed
- Ensure the user has admin role

See [scripts/README.md](./scripts/README.md) for more details.

## Database Backup

Add these to your `.env.local`:

```bash
BACKUP_PROD_DB_URL='your-production-url'
BACKUP_DEV_DB_URL='postgresql://user@localhost:5432/your_local_db'
```

Then run:

```bash
./scripts/backup/backup-and-restore.sh
```

## Database Schema

The application uses Prisma with PostgreSQL and includes the following models:

- **Artist**: Music artists with unique names and slugs
- **Album**: Albums with release dates, artwork, and artist relationships
- **Track**: Individual tracks with audio files, lengths, and album relationships

## API Routes

- `POST /api/upload`: Upload new albums with tracks
- `PATCH /api/album/[id]`: Update album information
- `DELETE /api/album/[id]`: Delete albums and associated files
- `GET /api/album/slug/[artist]/[album]`: Get album by slug
- `GET /api/download`: Download audio files

## Contributing

1. Write tests for new features
2. Ensure all tests pass
3. Follow the existing code style
4. Update documentation as needed
