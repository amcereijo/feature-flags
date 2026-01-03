# bun-api

A feature flag service implemented in TypeScript using [Bun](https://bun.sh/) and [Elysia](https://elysiajs.com/), with Clerk authentication.

---

## Project Structure

```
bun-api/
├── src/
│   ├── controllers/   # Route handlers (if needed)
│   ├── db/            # Database connection and schema initialization
│   ├── middleware/    # Clerk authentication middleware
│   ├── models/        # TypeScript types and interfaces
│   ├── routes/        # Route definitions (features, tokens, health)
│   └── utils/         # Utility functions (JWT helpers)
├── tests/             # Integration tests
├── index.ts           # Entry point - Elysia app setup
├── package.json
├── tsconfig.json
└── README.md
```

---

## Features

- REST API for managing feature flags
- Clerk authentication for protected routes
- JWT tokens for API access
- SQLite database (via Bun's built-in Database API)
- Health check endpoint
- CORS support
- Integration tests with Bun test runner

---

## Requirements

- [Bun](https://bun.sh/) v1.0+
- Clerk account with API keys

---

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Server Configuration
PORT=3000

# Clerk Authentication (required for production)
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# JWT Configuration (for API tokens)
JWT_SECRET=your_jwt_secret_change_in_production

# Test Mode (optional)
NODE_ENV=development  # Set to "test" to bypass Clerk authentication
```

**Note:** In test mode (`NODE_ENV=test`), Clerk authentication is bypassed to facilitate integration testing.

### 3. Database Configuration

The application automatically creates a SQLite database at `feature-flags.db` in the project root on first run. The database includes two tables:

- `api_tokens` - Stores API tokens for authentication
- `features` - Stores feature flags with metadata

You can modify the database path in `src/db/index.ts` if needed.

### 4. Run the Server

```bash
bun run index.ts
```

The server will start at `http://localhost:3000` (or the port specified in `PORT` environment variable).

---

## API Endpoints

All endpoints except `/health` require Clerk authentication via the `Authorization` header with a valid Bearer token.

### Health Check

- **GET** `/health` - Health check endpoint (no authentication required)
  - Response: `{ "status": "ok" }`

### API Tokens

- **POST** `/api/tokens` - Create a new API token
  - Body: `{ "name": "token-name", "createdByUid": "user-id" }`
  - Response: `{ "id": 1, "name": "token-name", "token": "jwt-token", ... }`

- **GET** `/api/tokens` - List all API tokens
  - Response: Array of token objects

- **DELETE** `/api/tokens/:id` - Delete an API token
  - Response: 204 No Content

### Feature Flags

- **POST** `/api/features` - Create a new feature flag
  - Body: `{ "name": "feature-name", "value": "true", "resourceId": "optional-id", "active": true }`
  - Response: `{ "id": 1, "name": "feature-name", "value": "true", ... }`

- **GET** `/api/features` - List all feature flags
  - Response: Array of feature objects

- **GET** `/api/features/:id` - Get a specific feature flag
  - Response: Feature object

- **PUT** `/api/features/:id` - Update a feature flag
  - Body: `{ "name": "new-name", "value": "false", "resourceId": "id", "active": false }`
  - Response: Updated feature object

- **DELETE** `/api/features/:id` - Delete a feature flag
  - Response: 204 No Content

---

## Authentication

### Clerk Authentication

All protected endpoints use Clerk for authentication. Include a valid Clerk session token in the `Authorization` header:

```bash
Authorization: Bearer <clerk-session-token>
```

### API Tokens (JWT)

The `/api/tokens` endpoints allow you to create JWT tokens that can be used for programmatic access. These tokens are signed using the `JWT_SECRET` environment variable.

---

## Example Usage

### 1. Authenticate with Clerk

First, obtain a Clerk session token from your frontend application or directly from Clerk.

### 2. Create an API Token

```bash
curl -X POST http://localhost:3000/api/tokens \
  -H "Authorization: Bearer <clerk-session-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-api-token", "createdByUid": "user_123"}'
```

### 3. Create a Feature Flag

```bash
curl -X POST http://localhost:3000/api/features \
  -H "Authorization: Bearer <clerk-session-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "new-feature", "value": "true", "active": true}'
```

### 4. List Feature Flags

```bash
curl -X GET http://localhost:3000/api/features \
  -H "Authorization: Bearer <clerk-session-token>"
```

### 5. Update a Feature Flag

```bash
curl -X PUT http://localhost:3000/api/features/1 \
  -H "Authorization: Bearer <clerk-session-token>" \
  -H "Content-Type: application/json" \
  -d '{"value": "false", "active": false}'
```

### 6. Delete a Feature Flag

```bash
curl -X DELETE http://localhost:3000/api/features/1 \
  -H "Authorization: Bearer <clerk-session-token>"
```

---

## Testing

### Running Tests

The project includes integration tests using Bun's built-in test runner:

```bash
bun test
```

Tests automatically:
- Start a test server on port 3456
- Bypass Clerk authentication in test mode
- Create test data
- Verify all CRUD operations
- Clean up after completion

### Test Files

- `tests/features.integration.test.ts` - Feature flags CRUD operations
- `tests/tokens.integration.test.ts` - API token management

---

## Tech Stack

### Core Dependencies

- **[Elysia](https://elysiajs.com/)** `^1.4.19` - Fast and ergonomic web framework for Bun
- **[@elysiajs/cors](https://elysiajs.com/plugins/cors)** `^1.4.1` - CORS plugin for Elysia
- **[@clerk/backend](https://clerk.com/docs)** `^1.34.0` - Clerk backend SDK for authentication
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** `^9.0.3` - JWT token generation and verification
- **[@sinclair/typebox](https://www.npmjs.com/package/@sinclair/typebox)** `^0.34.45` - JSON schema type builder

### Dev Dependencies

- **[@types/bun](https://www.npmjs.com/package/@types/bun)** `^1.3.5` - TypeScript types for Bun
- **TypeScript** `^5.9.3` - TypeScript compiler

### Built-in APIs

- **Bun.Database** - SQLite database driver (built into Bun)
- **Bun.test** - Test runner (built into Bun)

---

## Database Schema

### api_tokens

| Column         | Type     | Description                        |
|----------------|----------|------------------------------------|
| id             | INTEGER  | Primary key (auto-increment)       |
| name           | TEXT     | Token name/description             |
| token          | TEXT     | JWT token string (unique)          |
| created_at     | DATETIME | Creation timestamp                 |
| last_used_at   | DATETIME | Last usage timestamp               |
| created_by_uid | TEXT     | User ID who created the token      |

### features

| Column      | Type     | Description                        |
|-------------|----------|------------------------------------|
| id          | INTEGER  | Primary key (auto-increment)       |
| name        | TEXT     | Feature flag name                  |
| value       | TEXT     | Feature flag value                 |
| resource_id | TEXT     | Optional resource identifier       |
| active      | INTEGER  | Active status (0 or 1)             |
| created_at  | DATETIME | Creation timestamp                 |

---

## Configuration

### Environment Variables

| Variable                  | Required | Default        | Description                                    |
|---------------------------|----------|----------------|------------------------------------------------|
| PORT                      | No       | 3000           | Server port                                    |
| CLERK_SECRET_KEY          | Yes*     | -              | Clerk secret key for authentication            |
| CLERK_PUBLISHABLE_KEY     | Yes*     | -              | Clerk publishable key                          |
| JWT_SECRET                | No       | "supersecret"  | Secret for signing JWT tokens (change in prod) |
| NODE_ENV                  | No       | -              | Set to "test" to bypass authentication         |

*Required in production, optional in test mode

### Security Notes

- **Change `JWT_SECRET` in production** - The default value is only for development
- **Never commit `.env` files** - Keep your Clerk keys secure
- **Use environment-specific configurations** - Different keys for dev/staging/prod
- **Rotate API tokens regularly** - Implement token expiration policies

---

## Development

### Adding New Routes

1. Create route handlers in `src/routes/`
2. Register routes in `index.ts`
3. Apply `clerkMiddleware` for protected routes

Example:

```typescript
import { clerkMiddleware } from "./src/middleware/clerk";
import type { Elysia } from "elysia";

export function registerMyRoutes(app: Elysia) {
  app.get("/api/myroute", async (ctx) => {
    await clerkMiddleware(ctx);
    return { message: "Protected route" };
  });
}
```

### Database Migrations

Currently, the database schema is initialized on startup in `src/db/index.ts`. For production use, consider implementing a proper migration system.

---

## Troubleshooting

### Server won't start

- Verify Bun is installed: `bun --version`
- Check environment variables are set correctly
- Ensure port 3000 (or custom PORT) is available

### Authentication errors

- Verify Clerk keys are correct and active
- Check that the Authorization header includes `Bearer ` prefix
- Ensure the Clerk session token is valid and not expired

### Database errors

- Check file permissions for `feature-flags.db`
- Verify the database file isn't corrupted (delete and restart to recreate)
- Check SQLite is working: the database is created automatically on first run

### Test failures

- Ensure no other service is running on port 3456
- Check that `NODE_ENV=test` is set during test execution
- Verify test database is writable

---

## License

MIT

---

## Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Elysia Documentation](https://elysiajs.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)