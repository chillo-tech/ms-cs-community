# base
FROM node:20-alpine3.18 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# for lint
FROM base as linter
WORKDIR /app
RUN npm run lint

# for build
FROM linter as builder
WORKDIR /app
RUN npm run build


# for production
FROM node:20-alpine3.18 
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/build ./
EXPOSE 3000
ENTRYPOINT ["node","./app.js"]