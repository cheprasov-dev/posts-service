FROM node:20.8.0-alpine as builder

ARG NPM_TOKEN

WORKDIR /build
COPY ./ ./

RUN npm ci -q && \
    npm run build

FROM node:20.8.0-alpine

COPY --from=builder /build/dist /app/dist
COPY --from=builder /build/node_modules /app/node_modules
COPY .env /app/.env

WORKDIR /app

CMD ["node", "dist/main.js"]
