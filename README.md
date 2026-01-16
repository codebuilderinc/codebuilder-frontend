# Codebuilder Frontend

[![Deploy Production Docker Container](https://github.com/codebuilderinc/codebuilder-frontend/actions/workflows/deploy-docker.yml/badge.svg)](https://github.com/codebuilderinc/codebuilder-frontend/actions/workflows/deploy-docker.yml)

Next.js frontend for Codebuilder.

## Environment Files

- `pnpm dev` (Next.js dev server) loads environment variables in this order:
	- `.env.local` (preferred for local-only overrides)
	- `.env`
- Docker Compose loads `.env` because `docker-compose.yml` explicitly uses `env_file: ./.env`.

Important: inside Docker, Postgres must be reached via `db:5432` (service name + container port), not `localhost`.

## Commands

Run any command as:

```bash
pnpm <command>
```

List all available commands:

```bash
pnpm run
```

### Core

```bash
pnpm dev
pnpm build
pnpm build:static
pnpm start
pnpm lint
```

- `dev`: Start Next.js dev server (Turbopack).
- `build`: Production build.
- `build:static`: Static export build (only if export mode is supported).
- `start`: Run production server from `.next` build output.
- `lint`: Run linting.

### Local DB (for development)

```bash
pnpm dev:db:start
pnpm dev:db:stop
pnpm dev:db:prepare
```

- `dev:db:start`: Start the local Postgres container using `docker-compose.local.yml`.
- `dev:db:stop`: Stop/remove the local Postgres container.
- `dev:db:prepare`: Create the Prisma shadow database inside Postgres (safe to re-run).

### Prisma

```bash
pnpm prisma:migrate
pnpm prisma:generate
pnpm prisma:studio
```

- `prisma:migrate`: Run Prisma migrations in development mode.
- `prisma:generate`: Regenerate Prisma client.
- `prisma:studio`: Launch Prisma Studio.

### Docker (Production / Server)

```bash
pnpm prod:up
pnpm prod:down
pnpm prod:logs
pnpm prod:reset
```

- `prod:up`: Rebuild and redeploy the Docker Compose stack (frontend + db). This is the main manual deploy command.
- `prod:down`: Stop/remove the stack containers and networks (does not delete external volumes unless `--volumes` is used).
- `prod:logs`: Tail logs for the `frontend` service.
- `prod:reset`: WARNING: brings the stack down with `--volumes` and starts fresh (will wipe DB data).

## CI / Deployment

On push to `main`, the GitHub Actions workflow rebuilds and redeploys the Docker services on the self-hosted runner.

## Activity
![Alt](https://repobeats.axiom.co/api/embed/f01e046c8b7d8a2c653ee751c55c2345072872c4.svg "Repobeats analytics image")
