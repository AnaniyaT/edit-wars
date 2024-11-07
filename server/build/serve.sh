#!/bin/sh

# Run migrations
echo "Running migrations..."
exec /app/build/server --migrate

# Start the server
echo "Starting the server..."
exec /app/build/server
