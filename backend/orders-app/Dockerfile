FROM node:15 As builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
RUN npm install --only=production
COPY --from=builder /usr/src/app .
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
