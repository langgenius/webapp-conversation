
# WORKDIR /app

# COPY . .

# RUN yarn install
# RUN yarn build

# EXPOSE 3000

# CMD ["yarn","start"]



FROM --platform=linux/amd64 node:19-bullseye-slim

# Set the working directory
WORKDIR /app

# Copy only the package.json and lock files for dependency installation
COPY package.json yarn.lock ./ 

# Install dependencies (for production only, to keep the image small)
RUN yarn install --frozen-lockfile --production

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN yarn build

# Set environment variables (adjust as needed)
ENV PORT 3000
ENV NODE_ENV production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
