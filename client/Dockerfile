FROM node:18-alpine

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn install

RUN yarn global add serve

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]