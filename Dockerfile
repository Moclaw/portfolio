# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

RUN npm install -g serve

EXPOSE 5300

CMD ["serve", "-s", "build", "-l", "5300"]
