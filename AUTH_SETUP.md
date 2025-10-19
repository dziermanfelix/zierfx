# Authentication System Setup

This document describes the authentication system that has been set up for the admin area.

## Overview

The site now uses a proper session-based authentication system with JWT tokens stored in httpOnly cookies for security.

## What Was Added

### Database

- **User Model** in Prisma schema with fields:
  - `email` (unique)
  - `username` (unique)
  - `password` (hashed with bcrypt)
  - `role` (admin/user)
  - `createdAt` and `updatedAt` timestamps

### API Routes

- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/logout` - Clear session and logout
- `GET /api/auth/check` - Check if user is authenticated

### Pages

- `/login` - Beautiful login page with form-based authentication
- Protected routes: `/upload` and `/albums/[artist]/[album]/edit`

### Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens stored in httpOnly cookies (7-day expiration)
- Secure cookies in production
- Middleware protection for admin routes
- Automatic redirect to login page when accessing protected routes

## Admin User

An admin user has been created using the credentials from your `.env` file:

- Username: `dust`
- Password: `dust`

### To Change Admin Credentials

1. Update `ADMIN_USER` and `ADMIN_PASS` in your `.env` file
2. Run: `npm run seed`

Note: The seed script will skip creation if the user already exists.

## Environment Variables

Required in `.env`:

```bash
# Admin credentials for seeding
ADMIN_USER=your_username
ADMIN_PASS=your_password

# JWT secret (generated automatically)
JWT_SECRET=random_secret_key
```

## Usage

### Login

1. Navigate to `/login`
2. Enter username and password
3. On successful login, redirected to the page you were trying to access (or home)

### Accessing Protected Routes

- `/upload` - Upload new albums (requires authentication)
- `/albums/[artist]/[album]/edit` - Edit album details (requires authentication)

When not logged in, attempting to access these routes will redirect to the login page.

### Logout

- Navigate to any protected route when not logged in and you'll be redirected to login page

## Navigation Bar

The navigation bar shows consistent links across all pages:

- **Home**
- **Library**
- **Tour**

Additional features can be added to the navigation as needed.

## Code Structure

```
src/
├── lib/
│   └── auth.ts                    # Auth utilities (JWT, cookies)
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts     # Login endpoint
│   │       ├── logout/route.ts    # Logout endpoint
│   │       └── check/route.ts     # Auth check endpoint
│   └── login/
│       └── page.tsx               # Login page UI
├── middleware.ts                  # Route protection
└── components/
    └── Navigation.tsx             # Global navigation bar
```

## Security Notes

1. **httpOnly Cookies**: Tokens are stored in httpOnly cookies to prevent XSS attacks
2. **Hashed Passwords**: All passwords are hashed with bcrypt before storage
3. **Secure in Production**: Cookies are marked as secure in production (HTTPS only)
4. **Token Expiration**: Sessions expire after 7 days
5. **No Basic Auth**: Replaced the browser popup with proper form-based authentication

## Testing

To test the authentication:

1. Run `npm run dev`
2. Try to access `/upload` (should redirect to login)
3. Login with username `dust` and password `dust`
4. You should be redirected back to `/upload`
5. Navigate using the top navigation bar (Home, Library, Tour)

## Future Enhancements

Possible additions:

- Password reset functionality
- Email verification
- Rate limiting on login attempts
- Session management (view/revoke active sessions)
- Two-factor authentication
- User management page (create/edit/delete users)
