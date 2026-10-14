FROM node:22-alpine AS build

WORKDIR /app
COPY mockup/package.json mockup/package-lock.json ./
RUN npm ci

COPY mockup/ ./
RUN npm run build

FROM node:22-alpine AS runtime

RUN npm install --global serve@14.2.6
WORKDIR /app
COPY --chown=node:node --from=build /app/dist ./dist/platforma
COPY --chown=node:node serve.json ./serve.json
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/platforma/ || exit 1

CMD ["serve", "dist", "--config", "/app/serve.json", "--listen", "tcp://0.0.0.0:3000", "--no-clipboard"]
