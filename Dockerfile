FROM node:18-bullseye-slim

WORKDIR /home/node/app

# Install global dependencies
RUN npm install -g gulp-cli

# Copy package files and install dependencies
COPY package*.json ./
COPY . .
RUN npm install


# Compile your application
RUN npm run compile

CMD ["npm", "start"]
