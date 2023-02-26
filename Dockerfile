FROM node:19-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install --only=development

COPY . .

RUN npm run build