# Use Node.js 18 LTS
FROM node:18-alpine

# Install system dependencies including Python, FFmpeg, and yt-dlp
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    ffmpeg \
    && pip3 install --no-cache-dir --break-system-packages yt-dlp

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Build the application using npx commands
RUN npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Create temp directory for file processing
RUN mkdir -p /app/temp

# Expose port (Back4App uses 8080)
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production
ENV PORT=8080

# Ensure server binds to 0.0.0.0 for container access
ENV HOST=0.0.0.0

# Start the application
CMD ["npm", "start"]