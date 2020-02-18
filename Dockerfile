FROM node:12.12-alpine

WORKDIR /app
COPY tsconfig*.json ./
COPY src ./src/
COPY test ./test/
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm i && npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]