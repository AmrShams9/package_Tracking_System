#!/bin/bash

# Set up the network (create if it doesn't exist)
echo "Creating Docker network..."
docker network ls | grep -q "app-network" || docker network create app-network

# Start the PostgreSQL container
echo "Starting PostgreSQL container..."
docker run -d \
  --name db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=ibrahim1 \
  -e POSTGRES_DB=packageDB \
  -v "./insertadmin.sql:/docker-entrypoint-initdb.d/init.sql" \
  -v package_tracking_system_postgres_data:/var/lib/postgresql/data \
  -p 5433:5432 \
  --health-cmd="pg_isready -U postgres -d packageDB -h localhost" \
  --health-interval=10s \
  --health-timeout=5s \
  --health-retries=10 \
  --network app-network \
  postgres:16

sleep 10  

# Build and start backend container
echo "Building the backend image..."
docker build -t backend ./backend

echo "Starting backend container..."
docker run -d \
  --name backend \
  -p 5000:5000 \
  -e FLASK_APP=main.py \
  -e DB_NAME=packageDB \
  -e DB_HOST=db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=ibrahim1 \
  --network app-network \
  backend

# Build and start frontend container
echo "Building the frontend image..."
docker build -t frontend ./frontend

echo "Starting frontend container..."
docker run -d \
  --name frontend \
  -p 4200:4200 \
  --network app-network \
  frontend

# Output the URL for the frontend app
echo "Frontend app is running at http://localhost:4200"

echo "All containers are up and running!"
