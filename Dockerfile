FROM node AS builder

WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json .
RUN npm install --force

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run
FROM node AS runner

WORKDIR /app

# Copy only the built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port specified in vite.config.js or your application
EXPOSE 5300

# Command to run the application
CMD ["npm", "start"]
