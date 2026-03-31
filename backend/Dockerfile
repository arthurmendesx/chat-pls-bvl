FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies required by Prisma
RUN apk add --no-cache openssl

# Copy package files and prisma folder first to leverage Docker cache
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the NestJS application
RUN npm run build


FROM node:20-alpine AS production

WORKDIR /app

# Install dependencies required by Prisma for runtime
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production

# Copy generated Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
