FROM node:12.18.1

ENV NODE_ENV=production

WORKDIR /app

COPY /backend-payments/package.json /app/

RUN npm i --production

COPY .env /app/
COPY /deployments /app/deployments
COPY /backend-payments/ /app/

CMD ["npm", "run", "start-prod"]
