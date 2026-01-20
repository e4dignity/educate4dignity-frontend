# Build stage
FROM node:20-bullseye-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production
# Install only necessary runtime dependencies for the server
COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts
# Copy built assets and server
COPY --from=builder /app/dist ./dist
COPY server.cjs ./
EXPOSE 10000
CMD ["node", "server.cjs"]