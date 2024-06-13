FROM node:18-alpine

# Install necessary packages for multi-architecture builds
RUN apk add --no-cache qemu qemu-user-static

WORKDIR /home/node/app

COPY package*.json /home/node/app/
COPY . /home/node/app/
COPY ENV_EXAMPLE /home/node/app/.env

RUN npm install 
RUN npm run compile

CMD ["npm", "start"]
