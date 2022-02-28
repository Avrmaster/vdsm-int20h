FROM node:16-alpine
WORKDIR /app

COPY tsconfig.json ./tsconfig.json
COPY public ./public

ADD ./package.json .
ADD ./yarn.lock    .

RUN yarn --pure-lockfile

COPY src ./src
RUN yarn build

RUN mkdir /temp-web
# ----------| react build |----------------
RUN cp -R -p  /app/build/* /temp-web/
# --------------------| mounted volume |---
CMD cp -R /temp-web/*   /app/build-web/
