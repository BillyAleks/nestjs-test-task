FROM node:12-alpine

WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
COPY tsconfig*.json ./
COPY src ./src/
COPY test ./test/
COPY mysql ./mysql/
COPY ormconfig.js ./
RUN npm i && npm run build

EXPOSE 3000
