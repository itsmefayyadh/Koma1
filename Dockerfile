# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy all source code first
COPY inventori-project/inventori-frontend/ .

# Install dependencies (will now pick up correct package.json)
RUN npm install

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
