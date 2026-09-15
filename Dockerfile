FROM --platform=$BUILDPLATFORM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY build/ build/
COPY config/ config/
COPY src/ src/
COPY index.html .babelrc .postcssrc.js ./
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN mkdir -p static
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server/ ./server/
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server"]
