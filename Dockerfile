FROM node:20

WORKDIR /app

COPY package* .

RUN npm install

CMD ["npm","run","dev"]
