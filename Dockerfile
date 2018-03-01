FROM node:8.9.4

WORKDIR /tmp
COPY package.json .
RUN yarn install

WORKDIR /usr/src/app
COPY . .
RUN cp -a /tmp/node_modules .
CMD yarn build

EXPOSE 4000
