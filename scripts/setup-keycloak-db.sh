#!/bin/bash
# Script to create Keycloak database in PostgreSQL

echo "Creating Keycloak database..."

# Get PostgreSQL connection details from environment or use defaults
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
POSTGRES_HOST=${POSTGRES_HOST:-localhost}
POSTGRES_PORT=${POSTGRES_PORT:-5432}

# Create database using psql
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d postgres -c "CREATE DATABASE keycloak;" 2>/dev/null || echo "Database 'keycloak' may already exist or connection failed."

echo "Keycloak database setup complete!"
echo "Note: If running in Docker, you may need to execute this inside the postgres container:"
echo "  docker-compose exec postgres psql -U postgres -c 'CREATE DATABASE keycloak;'"

