FROM node:14-alpine

WORKDIR app

ADD ./package.json .
ADD ./yarn.lock .
RUN yarn install --pure-lockfile

ADD . .
RUN yarn build
CMD ["yarn", "build:start"]
