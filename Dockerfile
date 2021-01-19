FROM node:14
WORKDIR /usr/src/app

ENV PORT 4000
ENV ADDRESS 0.0.0.0

COPY build /usr/src/app

RUN yarn --frozen-lockfile

CMD [ "yarn", "start" ]
EXPOSE ${PORT}