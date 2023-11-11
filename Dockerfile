# ! Not Working 
# Use the official Node.js 16 image as the base image
FROM node:16

# Install necessary dependencies for Puppeteer and Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libglib2.0-0 \
    libfontconfig1 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxi6 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    && apt-get install -y chromium \
    && rm -rf /var/lib/apt/lists/*

# Set up environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 8080 for the application
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
