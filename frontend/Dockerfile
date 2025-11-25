# Use official Node.js LTS image as base
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 (default for Next.js)
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "dev"]
