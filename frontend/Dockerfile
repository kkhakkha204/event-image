FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy application code
COPY . .

# Fix permissions for node_modules/.bin
RUN chmod +x node_modules/.bin/*

# Build Next.js
RUN npm run build

# Clean up dev dependencies after build
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]