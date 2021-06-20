FROM node:12.18.1

WORKDIR /app

COPY /.husky/ /app/.hustky/
COPY /contracts/ /app/contracts/
COPY .env /app/
COPY hardhat.config.ts /app/
COPY package-lock.json /app/
COPY package.json /app/
COPY tsconfig.json /app/
COPY yarn.lock /app/

RUN npm i

COPY . /app/

CMD /bin/bash
