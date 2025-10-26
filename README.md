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

## Recommended Workflow

1. Make your changes in the appropriate branch.
2. Commit and push from the root of the repository.
3. If you work on both projects, you can make joint or separate commits as needed.

## Notes

- Check the README in each subfolder for project-specific instructions.

---
