FROM node:26.13.1-alpine

WORKDIR /app

COPY server/package*.json ./

RUN npm ci

EXPOSE 3001

CMD ["sleep", "infinity"]
