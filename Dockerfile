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

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create temp directory for file processing
RUN mkdir -p /app/temp

# Expose port (Railway will override this)
EXPOSE $PORT

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]