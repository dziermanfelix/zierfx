# Zierman Felix

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
- `npm run migrate`: Run database migrations
- `npm run studio`: Open Prisma Studio
- `npm run clean`: Clean database
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage

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
