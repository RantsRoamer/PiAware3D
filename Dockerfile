# Stage 1: Build the Vite frontend
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Lean production image — only Express + the built frontend
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies (express + cross-env)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the compiled frontend from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the Express server
COPY server.js ./

EXPOSE 3001

CMD ["node", "server.js"]
