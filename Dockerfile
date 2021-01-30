FROM node:12.20.1-alpine3.10

WORKDIR /usr/src/app

RUN apk update
RUN apk add --update-cache \
    bash \
    nano \
    make
