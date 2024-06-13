FROM node:18-alpine

WORKDIR /home/node/app

COPY package*.json /home/node/app/
COPY . /home/node/app/
COPY ENV_EXAMPLE /home/node/app/.env

RUN npm install -g npm@10.8.1
RUN npm ci
RUN npm run compile

CMD ["npm", "start"]
