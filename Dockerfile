FROM node:hydrogen-bullseye-slim

WORKDIR /usr/app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 9051

CMD ["yarn", "start"]
