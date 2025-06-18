#!/bin/sh
#
# This script is the entrypoint for the Docker container.
# It ensures the database is ready before running migrations and starting the app.

# Exit immediately if a command exits with a non-zero status.
set -e

# The host for the database, read from an environment variable.
# We'll set this to 'db' in the docker-compose.yml file.
DB_HOST=${DATABASE_HOST:-db}
DB_PORT=${DATABASE_PORT:-5432}

echo "Waiting for database at $DB_HOST:$DB_PORT to be ready..."

# Loop until we can successfully connect to the database port.
# nc (netcat) is a small utility perfect for this.
while ! nc -z $DB_HOST $DB_PORT; do
      sleep 1 # wait for 1 second before trying again
done

echo "Database is ready."

# Run Prisma migrations.
# 'prisma migrate deploy' is the command intended for production/CI/CD environments.
# It applies pending migrations without generating new ones.
echo "Running database migrations..."
npx prisma migrate deploy

echo "Migrations complete."

# Now, execute the main command provided to the container (e.g., "pnpm start").
# 'exec "$@"' replaces the shell process with the given command,
# ensuring it becomes the main process (PID 1) and receives signals correctly.
exec "$@"
