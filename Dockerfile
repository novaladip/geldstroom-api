FROM node:12.10.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm build

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]