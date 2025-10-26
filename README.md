# feature-flags (Monorepo)

This repository contains all projects related to the feature flags system, organized as a monorepo. All code is versioned under this main repository.

## Monorepo Structure

- `api/`
  Go API with SQLite for feature flag management.

- `web-client/`
  Modern React web client for managing feature flags.

## Cloning the Repository

To clone the monorepo:

```sh
git clone git@github.com:amcereijo/feature-flags.git
cd feature-flags
```

## Working with Subprojects

Each subproject is a regular folder inside the main repository. You can enter each one and use the usual tools:

```sh
cd api
# or
cd web-client
```

All changes are managed from the root of the main repository. There are no internal `.git` folders in the subprojects.

## Recommended Structure

- `api/` - Go + SQLite backend (see specific README in `api/`)
- `web-client/` - React frontend (see specific README in `web-client/`)

## Requirements to Run `start.sh`

To run both the backend and frontend together using `start.sh`, ensure you have the following installed:

- **sh/bash/zsh**: Standard shell environment (default on macOS/Linux)
- **Go**: Version 1.23.0 or higher (`go version`)
- **Node.js**: Version 18 or higher (`node -v`)
- **npm**: Comes with Node.js (`npm -v`)
- **sed, date**: Standard Unix tools (default on macOS/Linux)
- **Network ports**: Ensure ports `8080` (backend) and `5173` (frontend) are available
- **Configure env variables**: See the "Environment Variable Configuration" section below

You can run the script with:
```sh
sh start.sh
```
The script will automatically install frontend dependencies if needed and create an empty `api/.env` file if it does not exist.


## Environment Variable Configuration

Both the `web-client` and `api` projects require environment variables to be set via `.env` files. Example files are provided in each subproject to help you get started.

### Setting up `.env` files

#### web-client

1. Copy the example file:
   ```sh
   cp web-client/.env.example web-client/.env
   ```
2. Open `web-client/.env` and fill in the required variables. For Clerk authentication, set:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```
   Replace `your_clerk_publishable_key_here` with your actual Clerk publishable key.

#### api

1. Copy the example file:
   ```sh
   cp api/.env.example api/.env
   ```
2. Open `api/.env` and fill in the required variables as documented in the example file (such as database URLs, secret keys, etc).

**Note:** Never commit your `.env` files with real secrets to version control.


## Recommended Workflow

1. Make your changes in the appropriate branch.
2. Commit and push from the root of the repository.
3. If you work on both projects, you can make joint or separate commits as needed.

## Notes

- Check the README in each subfolder for project-specific instructions.

---
