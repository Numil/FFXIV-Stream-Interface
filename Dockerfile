# syntax = docker/dockerfile:1

ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-slim AS base
ARG PORT=3000

RUN apt-get update && apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

WORKDIR /src

FROM base AS build

COPY --link package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable

COPY --link . .

RUN yarn postinstall && yarn run build

FROM base

ENV PORT=$PORT
ENV NODE_ENV=production

COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]
