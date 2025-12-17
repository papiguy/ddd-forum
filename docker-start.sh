#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "Error: .env file not found. Please create one from .env.template"
  exit 1
fi

# Get the database type from environment variable, default to mysql
DB_TYPE=${DDD_FORUM_DB_TYPE:-mysql}

echo "======================================"
echo "Starting DDD Forum with $DB_TYPE database"
echo "======================================"

# Start Docker Compose with the appropriate profile
docker-compose --profile $DB_TYPE up -d

echo ""
echo "Services started successfully!"
echo ""
echo "Database: $DB_TYPE"

case $DB_TYPE in
  mysql)
    echo "  - MySQL running on port ${DDD_FORUM_DB_PORT:-3306}"
    echo "  - Adminer UI: http://localhost:8080"
    ;;
  postgres)
    echo "  - PostgreSQL running on port ${DDD_FORUM_DB_PORT:-5432}"
    echo "  - Adminer UI: http://localhost:8080"
    ;;
  mongodb)
    echo "  - MongoDB running on port ${DDD_FORUM_DB_PORT:-27017}"
    echo "  - Mongo Express UI: http://localhost:8081"
    ;;
esac

echo "  - Redis running on port ${DDD_FORUM_REDIS_PORT:-6379}"
echo ""
echo "To stop: docker-compose --profile $DB_TYPE down"
echo "To view logs: docker-compose logs -f"
