## Brocabs dev quickstart

**You are a TypeScript assistant. Use pnpm instead of npm for all commands.**

### Prerequisites

- Node.js >= 22.19.0
- pnpm (repo uses pnpm@10.x)

**Important: This project uses Corepack to manage package managers.**

Enable Corepack (if not already enabled):

```sh
corepack enable
```

This ensures the correct version of pnpm is used automatically.

**NEVER use `npm install` or any npm commands.** This repository exclusively uses pnpm. Always use `pnpm install`, `pnpm add`, etc.

### 1) Install dependencies

```sh
pnpm install
```

### 2) Environment variables

Copy the sample env file and adjust as needed:

```sh
cp .env.sample .env
```

Defaults in `.env`:

- `PORT=3042` — the Platformatic runtime serves everything on http://localhost:3042
- `PLT_DB_DATABASE_URL=sqlite://./db.sqlite` — SQLite database for the Platformatic DB service (the “agent”)
- Other `PLT_*` flags configure the runtime and logging

Important: The `.env` file MUST live in the repository root (next to `watt.json`). Do not place separate `.env` files inside individual `apps/*` packages. The Platformatic / wattpm runtime loads root-level environment variables once and orchestrates all apps with Node.js workers. Per-app env files will be ignored.

If you prefer Postgres for the Nest API, ensure a Postgres instance is running and update the connection string in `apps/api/src/app.module.ts` (currently hard-coded to `postgresql://postgres:postgres@localhost:5432/brocabs`).

### 3) Run the app

```sh
pnpm dev
```

This starts the Platformatic runtime, which wires up the services behind a single port:

- App gateway: http://localhost:3042
- Web (TanStack Start): served at `/` via the gateway
- API (Nest): served at `/api` via the gateway

Notes

- If Postgres isn’t running, the API at `/api` may fail to start. The rest of the app (gateway, web, and the DB “agent” using SQLite) will still run.
- You can switch the DB agent to a different database by changing `PLT_DB_DATABASE_URL` in `.env`.

### Useful scripts

- Development: `pnpm dev`
- Build: `pnpm build`
- Start (after build): `pnpm start`

### Adding dependencies (pnpm)

Always add dependencies from the repository root so the workspace stays consistent and the lockfile is updated.

- To add a dependency to the root (shared tooling, etc.):

  ```sh
  pnpm add <package>
  pnpm add -D <package>  # dev dependency
  ```

- To add a dependency to a specific app (monorepo package), use the workspace filter:

  ```sh
  # API package
  pnpm --filter api add <package>
  pnpm --filter api add -D <package>

  # Web package
  pnpm --filter web add <package>
  pnpm --filter web add -D <package>
  ```

- Committing changes: When adding or removing dependencies, commit both the affected `package.json` files and the updated `pnpm-lock.yaml`:

  - The lockfile is the source of truth for exact versions; omitting it will cause non-reproducible installs.

- Upgrading to latest: `pnpm add <package>@latest` (or use `pnpm up <package>` for upgrades).

### Architecture overview

The project is a single composed runtime managed by Platformatic (`wattpm`). Instead of running each app independently, the root `watt.json` autoloads the `apps` directory and spins up each service (API, Web, DB agent, Gateway) inside coordinated Node.js workers.

The gateway (`apps/gateway/watt.json`) defines how traffic is routed:

- `/api` -> Nest API worker (`id: api`)
- `/` -> Web (TanStack Start) worker (`id: web`)
- `/` also internally has access to the DB agent (`id: db`) for data operations through Platformatic conventions.

Because of this stitching model:

- Treat the monorepo as a single application.
- Configure all shared environment variables once in the root `.env`.
- Use `pnpm dev` from the root to boot the entire system.

### What’s running

- Port: 3042 (configurable via `PORT` in `.env`)
- API: `/api` (Nest)
- Web: `/` (@tanstack/start)

### Troubleshooting

- Port already in use: change `PORT` in `.env`.
- Node version mismatch: use Node 22.19+.
- API DB connection errors: start Postgres locally or update the connection string in `apps/api/src/app.module.ts`.

### Nest CLI (API development)

The Nest application in `apps/api` can leverage the Nest CLI for rapid scaffolding.

Common commands (run from repository root or inside `apps/api`):

```sh
# Generate a module
pnpm --filter api nest g module users

# Generate a controller
pnpm --filter api nest g controller users --flat

# Generate a service
pnpm --filter api nest g service users

# Generate everything (resource CRUD boilerplate)
pnpm --filter api nest g resource users
```

If run from `apps/api` directly (cwd = `apps/api`), you can omit the workspace filter:

```sh
nest g module users
nest g controller users --flat
nest g service users
```

Documentation: https://docs.nestjs.com/cli/usages

Tips:

- Use `--dry-run` to preview changes.
- Add `--no-spec` if you don’t want test files.
- Keep generated files committed with the monorepo’s root `.env` configuration; avoid placing env files inside `apps/api`.

### Formatting (Prettier)

The repository standardizes on double quotes. Config is enforced via the root `.prettierrc` plus per-app config files.

Run formatting across the entire repo:

```sh
pnpm exec prettier --write .
```

Or check without writing:

```sh
pnpm exec prettier --check .
```

If an editor still shows single quotes, ensure it’s not using a cached local Prettier version and reload the workspace.
