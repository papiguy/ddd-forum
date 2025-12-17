#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "Warning: .env file not found. Using default database type (mysql)"
fi

# Get the database type from environment variable, default to mysql
DB_TYPE=${DDD_FORUM_DB_TYPE:-mysql}

echo "======================================"
echo "Stopping DDD Forum services ($DB_TYPE profile)"
echo "======================================"

# Stop Docker Compose with the appropriate profile
docker-compose --profile $DB_TYPE down

echo ""
echo "Services stopped successfully!"
echo ""
echo "To start again: ./docker-start.sh"
echo "To remove volumes (DANGER - deletes data): docker-compose down -v"
