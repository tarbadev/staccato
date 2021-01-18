FROM node:14
WORKDIR /usr/src/app

COPY build /usr/src/app

RUN yarn --frozen-lockfile

CMD [ "yarn", "start" ]
EXPOSE 4000