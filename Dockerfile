FROM node:16 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000
CMD ["node", "dist/main.js"]