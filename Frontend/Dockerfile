# Use the official Node.js image as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose port 4200 (default Angular development server port)
EXPOSE 4200

# Run the Angular development server
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

