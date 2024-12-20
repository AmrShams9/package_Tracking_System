#!/bin/bash

# Stop the containers
echo "Stopping containers..."
docker stop frontend backend db

# Remove the containers
echo "Removing containers..."
docker rm frontend backend db

# Remove the network if it's not needed anymore
echo "Removing network..."
docker network rm app-network

echo "Containers, volumes, and network are removed!"
