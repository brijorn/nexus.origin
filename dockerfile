FROM node:12

WORKDIR /bot

COPY package*.json ./

RUN npm install

COPY . .

ENV BOT_TOKEN=Discord_Bot_Token
ENV DEFAULT_ROBLOSECURITY=Roblosecurity_to_use

ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV DB_USER=Postgres_Database_User
ENV DB_PASS=Postgres_Database_Password


CMD ["npm", "start"]
