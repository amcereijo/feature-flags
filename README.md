# feature-flags (Monorepo)

This repository contains all projects related to the feature flags system, organized as a monorepo. All code is versioned under this main repository.

## Monorepo Structure

- `api/`
  Go API with SQLite for feature flag management.

- `bun-api/`
  TypeScript API using Bun and Elysia with SQLite for feature flag management (currently active backend).

- `web-client/`
  Modern React web client for managing feature flags with Clerk authentication.

## Cloning the Repository

To clone the monorepo:

```sh
git clone git@github.com:amcereijo/feature-flags.git
cd feature-flags
```

## Working with Subprojects

Each subproject is a regular folder inside the main repository. You can enter each one and use the usual tools:

```sh
cd api        # Go backend (legacy)
cd bun-api    # Bun/TypeScript backend (active)
cd web-client # React frontend
```

All changes are managed from the root of the main repository. There are no internal `.git` folders in the subprojects.

## Quick Start

### Prerequisites

To run the full stack using `start.sh`, ensure you have:

- **sh/bash/zsh**: Standard shell environment (default on macOS/Linux)
- **Bun**: Version 1.0 or higher (`bun --version`) - [Install Bun](https://bun.sh/)
- **Node.js**: Version 18 or higher (`node -v`)
- **npm**: Comes with Node.js (`npm -v`)
- **sed, date**: Standard Unix tools (default on macOS/Linux)
- **Network ports**: Ensure ports `3000` (bun-api) and `5173` (frontend) are available
- **Clerk Account**: For authentication (see Environment Variable Configuration below)

### Running the Full Stack

The `start.sh` script runs both the Bun backend and React frontend in parallel:

```sh
sh start.sh
```

The script will:
- Install frontend dependencies if needed (`web-client/node_modules`)
- Start the Bun API backend on port 3000
- Start the Vite React frontend on port 5173
- Display logs from both services with prefixes for clarity

**Note:** The Go API (`api/`) is not started by default. The `bun-api` is the currently active backend.

## Environment Variable Configuration

Both the `web-client` and `bun-api` projects require environment variables to be set via `.env` files. Example files are provided in each subproject to help you get started.

### Setting up `.env` files

#### bun-api (Required)

1. Create the `.env` file:
   ```sh
   cd bun-api
   touch .env
   ```

2. Add the following variables:
   ```env
   # Server Configuration
   PORT=3000

   # Clerk Authentication (required for production)
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

   # JWT Configuration (for API tokens)
   JWT_SECRET=your_jwt_secret_change_in_production

   # Test Mode (optional)
   NODE_ENV=development  # Set to "test" to bypass Clerk authentication
   ```

3. Get your Clerk keys:
   - Sign up at [clerk.dev](https://clerk.dev)
   - Create a new application
   - Copy your API keys from the Clerk dashboard
   - Replace the placeholder values in `.env`

#### web-client (Required)

1. Create the `.env` file:
   ```sh
   cd web-client
   touch .env
   ```

2. Add the following variables:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:3000

   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

3. Use the same Clerk publishable key from your Clerk dashboard.

#### api (Optional - Go Backend)

If you want to use the Go backend instead:

1. Copy the example file:
   ```sh
   cp api/.env.example api/.env
   ```

2. Fill in the required variables as documented in the example file.

3. Update `start.sh` to run the Go backend instead of `bun-api`.

**Security Note:** Never commit your `.env` files with real secrets to version control.

## Project Details

### bun-api (Active Backend)

**Technology Stack:**
- Bun runtime with TypeScript
- Elysia web framework
- SQLite database (via Bun's built-in Database API)
- Clerk authentication
- JWT tokens for API access

**Features:**
- REST API for feature flag management
- API token generation and management
- Health check endpoint
- Clean architecture with usecases and mappers
- Integration tests
- CORS support

**Documentation:** See `bun-api/README.md` for detailed API documentation.

### web-client (Frontend)

**Technology Stack:**
- React 19 with TypeScript
- Vite 7 for build tooling
- Mantine UI v8 for components
- React Query v5 for data fetching
- Clerk for authentication
- React Router v7

**Features:**
- Feature flag CRUD operations
- API token management
- Custom Clerk authentication UI
- Protected routes
- Real-time updates with React Query
- Responsive design

**Documentation:** See `web-client/README.md` for detailed setup and features.

### api (Legacy Go Backend)

**Technology Stack:**
- Go 1.23+
- SQLite database
- gRPC and REST endpoints
- Protocol Buffers

**Status:** Available but not actively used by `start.sh`. See `api/README.md` for details.

## Development Workflow

### Working on the Backend (bun-api)

```sh
cd bun-api
bun install           # Install dependencies
bun run index.ts      # Start the server
bun test             # Run tests
```

### Working on the Frontend (web-client)

```sh
cd web-client
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
```

### Working on Both

Use the root-level `start.sh` script to run both services in parallel with automatic log prefixing.

## API Endpoints

### Health Check (Public)
- `GET /health` - Check API status (no authentication required)

### Authentication Required
All other endpoints require Clerk authentication via Bearer token in the `Authorization` header.

### Feature Flags
- `POST /api/features` - Create a feature flag
- `GET /api/features` - List all feature flags
- `GET /api/features/:id` - Get a specific feature flag
- `PUT /api/features/:id` - Update a feature flag
- `DELETE /api/features/:id` - Delete a feature flag

### API Tokens
- `POST /api/tokens` - Create a new API token
- `GET /api/tokens` - List all API tokens
- `DELETE /api/tokens/:id` - Delete an API token

**Full API Documentation:** See `bun-api/README.md` for detailed endpoint specifications and examples.

## Database

Both backend implementations use SQLite for data persistence:

- **bun-api:** Creates `feature-flags.sqlite` in the `bun-api/` directory
- **api (Go):** Creates `data.db` in the `api/` directory

The databases are automatically created and initialized on first run.

## Testing

### Backend Tests (bun-api)
```sh
cd bun-api
bun test
```

Tests automatically bypass Clerk authentication in test mode and run on port 3456.

### Frontend Tests
Testing setup can be added to `web-client/` as needed.

## Deployment Considerations

### Environment-Specific Configuration
- Use different Clerk projects for development, staging, and production
- Change `JWT_SECRET` in production (never use the default)
- Configure appropriate CORS settings for your domains
- Set `NODE_ENV=production` for production deployments

### Database
- SQLite is suitable for small to medium deployments
- Consider PostgreSQL or MySQL for larger scale deployments
- Implement database migrations for production schema changes

### Hosting
- **Backend:** Deploy to platforms supporting Bun (e.g., Railway, Fly.io, DigitalOcean)
- **Frontend:** Deploy to static hosting (Vercel, Netlify, Cloudflare Pages)
- Ensure environment variables are properly configured in your hosting platform

## Troubleshooting

### Port Already in Use
If ports 3000 or 5173 are already in use, you can:
- Stop the conflicting service
- Change the port in the respective `.env` file
- Use `lsof -i :3000` or `lsof -i :5173` to find the process

### Authentication Errors
- Verify Clerk keys are correct and match between frontend and backend
- Ensure Clerk application is properly configured in the Clerk dashboard
- Check that redirect URLs are configured in Clerk settings

### Database Issues
- Delete the SQLite database file and restart to recreate
- Check file permissions for the database file
- Ensure sufficient disk space

### Dependency Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Bun cache: `bun pm cache rm`
- Ensure Bun and Node.js versions meet requirements

## Contributing

1. Create a feature branch from `main`
2. Make your changes in the appropriate subproject(s)
3. Test your changes locally using `start.sh`
4. Commit and push from the root of the repository
5. Create a pull request

## Recommended Structure

```
feature-flags/
├── api/                    # Go backend (legacy)
│   ├── cmd/
│   ├── internal/
│   ├── proto/
│   └── README.md
├── bun-api/               # Bun/TypeScript backend (active)
│   ├── src/
│   ├── tests/
│   ├── index.ts
│   └── README.md
├── web-client/            # React frontend
│   ├── src/
│   ├── public/
│   └── README.md
├── start.sh               # Start script for full stack
└── README.md              # This file
```

## Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Elysia Documentation](https://elysiajs.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [Mantine UI Documentation](https://mantine.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vite.dev/)

## License

This project is licensed under the MIT License.

---

For specific implementation details, refer to the README files in each subproject directory.