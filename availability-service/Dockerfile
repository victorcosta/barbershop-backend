FROM node:18-alpine AS stage

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3003

CMD ["yarn", "start"]