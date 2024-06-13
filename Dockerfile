FROM node:18-bullseye-slim

WORKDIR /home/node/app

# Install global dependencies
RUN npm install -g gulp-cli

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your files
COPY . .

# Copy environment example to .env
COPY ENV_EXAMPLE ./.env

# Compile your application
RUN npm run compile

CMD ["npm", "start"]
