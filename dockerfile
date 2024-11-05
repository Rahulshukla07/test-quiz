# Use official Node.js image as base
FROM public.ecr.aws/docker/library/node:20.0.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# Expose necessary ports
EXPOSE 5000

# Command to run your application
CMD ["npm", "run", "dev"]
