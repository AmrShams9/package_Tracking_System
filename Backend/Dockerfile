# Use Python 3.9 as the base image (can also use 3.10 if you prefer)
FROM python:3.9-slim

# Set the working directory inside the container to /app
WORKDIR /app

# Install curl (and other dependencies if necessary)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    build-essential \
    curl && rm -rf /var/lib/apt/lists/*

# Copy the requirements.txt into the container's /app directory
COPY requirements.txt .

# Install the dependencies listed in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files into the container's /app directory
COPY . .

ENV DB_HOST=db
ENV DB_USER=postgres
ENV DB_PASSWORD=ibrahim1
ENV DB_NAME=packageDB

# Expose port 5000 for Flask to run (default Flask port)
EXPOSE 5000

# Command to run the Flask app
CMD ["python", "main.py"]
