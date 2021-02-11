FROM node:14.15.4-slim AS builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src ./
RUN yarn install && yarn build

FROM node:14.15.4-alpine3.12
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --only=production --cache /tmp/empty-cache && rm -rf /tmp/empty-cache
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["yarn", "start"]
