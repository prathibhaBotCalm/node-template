FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first and install dependencies
# This leverages Docker layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Set NODE_ENV
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Define healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1

# Run the application
CMD ["node", "dist/index.js"]