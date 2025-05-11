# Build Stage
FROM node AS builder

WORKDIR /app

# Copy package files and install dependencies in cached layer
COPY package*.json ./
RUN npm ci

# Copy the rest of the application and build
COPY . .

# Build the app
RUN npm run build

# Runner Stage
FROM node AS runner

WORKDIR /app

# Copy only package files and install production dependencies
COPY --from=builder /app/package*.json ./

# Copy built files
COPY --from=builder /app/dist ./dist

# Expose application port
EXPOSE 5300

# Start the application
CMD ["npm", "start"]
