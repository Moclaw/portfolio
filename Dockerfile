# Stage 1: Build
FROM node:20-alpine@sha256:4d8e8f022ff5eaeaaf48991bf3a3331efea9e6c2447f8f5a0bd0c0511d35f26d AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY package*.json ./
# Cài đặt dependencies
RUN npm install -force

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Stage 2: Serve
FROM nginx:1.25.2-alpine@sha256:0f3a4b5c7d8e9f6c3b8e2a1d4f5e6c7d8e9f6c3b8e2a1d4f5e6c7d8e9f6c3b8
# Xóa cache để giảm kích thước container
RUN rm -rf /usr/share/nginx/html/*

# Sao chép build từ stage builder vào nginx container
COPY --from=builder /app/build /usr/share/nginx/html

# Expose cổng 80 (đây là cổng mặc định của nginx)
EXPOSE 5300

# Lệnh mặc định để khởi chạy nginx
CMD ["nginx", "-g", "daemon off;"]