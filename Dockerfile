FROM iojs:2.0.1-slim

MAINTAINER Rob Hogan

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install -g mocha && npm install

EXPOSE 3000

CMD node server/server.js
