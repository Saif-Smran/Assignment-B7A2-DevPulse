# DevPulse – Internal Tech Issue & Feature Tracker

DevPulse is a collaborative backend API for software teams to report bugs, request features, and coordinate issue resolution.

## Live URL

Live URL: <add your deployed backend URL here>

## Features

- User registration and login with JWT authentication
- Contributor and maintainer roles
- Create issues as authenticated users
- View all issues with optional sorting and filtering
- View a single issue with reporter details
- Update issues with role-based access control
- Delete issues as a maintainer
- PostgreSQL-backed persistence with automatic table initialization

## Tech Stack

- Node.js 24+
- TypeScript
- Express.js
- PostgreSQL
- Native `pg` driver
- `bcrypt` for password hashing
- `jsonwebtoken` for JWT handling

## Project Structure

- `src/app.ts` - Express app setup and route registration
- `src/server.ts` - Server bootstrap
- `src/config/` - Environment configuration
- `src/db/` - PostgreSQL pool and table initialization
- `src/middleware/` - Authentication and error handling
- `src/modules/auth/` - Signup and login flow
- `src/modules/issues/` - Issue CRUD logic
- `src/utility/` - Shared response helpers

## Environment Variables

Create a `.env` file in the project root with:

```env
PORT=5000
CONNECTIONSTRING=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-key
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Configure the environment variables in `.env`.

3. Start the development server:

```bash
npm run dev
```

4. Build the project for production:

```bash
npm run build
```

5. Start the compiled server:

```bash
npm start
```

The application creates the required database tables automatically when the server starts.

## Authentication Flow

- Register a user with `POST /api/auth/signup`
- Log in with `POST /api/auth/login`
- Use the returned JWT token in the `Authorization` header for protected routes

Example header:

```http
Authorization: <JWT_TOKEN>
```

## API Endpoints

### Authentication

#### `POST /api/auth/signup`

Public route for user registration.

Request body:

```json
{
	"name": "John Doe",
	"email": "john.doe@devpulse.com",
	"password": "securePassword123",
	"role": "contributor"
}
```

#### `POST /api/auth/login`

Public route for login and token generation.

Request body:

```json
{
	"email": "john.doe@devpulse.com",
	"password": "securePassword123"
}
```

### Issues

#### `POST /api/issues`

Authenticated users can create a new issue.

Request body:

```json
{
	"title": "Database connection timeout under load",
	"description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
	"type": "bug"
}
```

#### `GET /api/issues?sort=newest&type=bug&status=open`

Public route to retrieve issues with optional filtering and sorting.

Supported query parameters:

- `sort`: `newest` or `oldest`
- `type`: `bug` or `feature_request`
- `status`: `open`, `in_progress`, or `resolved`

#### `GET /api/issues/:id`

Public route to retrieve a single issue by ID.

#### `PATCH /api/issues/:id`

Protected route for updating an issue.

#### `DELETE /api/issues/:id`

Protected maintainer-only route for deleting an issue.

## Database Schema Summary

### `users`

- `id` - auto-incrementing primary key
- `name` - required display name
- `email` - required unique login email
- `password` - required hashed password, never returned in responses
- `role` - `contributor` or `maintainer`, defaults to `contributor`
- `created_at` - auto-generated timestamp
- `updated_at` - auto-generated timestamp

### `issues`

- `id` - auto-incrementing primary key
- `title` - required, maximum 150 characters
- `description` - required, minimum 20 characters
- `type` - `bug` or `feature_request`
- `status` - `open`, `in_progress`, or `resolved`, defaults to `open`
- `reporter_id` - user ID of the reporter
- `created_at` - auto-generated timestamp
- `updated_at` - auto-generated timestamp

## Response Format

### Success

```json
{
	"success": true,
	"message": "Operation description",
	"data": {}
}
```

### Error

```json
{
	"success": false,
	"message": "Error description",
	"errors": {}
}
```

## Notes

- Passwords are hashed before storage.
- Protected issue routes require a valid JWT token.
- Reporter details are returned without SQL JOINs.
- Interview video and deployment link should be added before submission.
