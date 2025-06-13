# Build stage for client
FROM node:18-alpine as client-build

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install client dependencies
RUN npm install

# Copy client source code
COPY client/ .

# Build client
RUN npm run build

# Build stage for server
FROM node:18-alpine

WORKDIR /app

# Copy server package files
COPY package*.json ./

# Install server dependencies
RUN npm install

# Copy server source code
COPY . .

# Copy built client files from client-build stage
COPY --from=client-build /app/client/build ./client/build

# Create uploads directory
RUN mkdir -p uploads/profile-images

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 