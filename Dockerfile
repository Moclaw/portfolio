# ---------- Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build


# ---------- Production Runner Stage ----------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5300

# Start the app
CMD ["node", "dist/index.js"]
