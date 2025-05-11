# Stage 1: Build
FROM node:20-alpine AS builder

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
FROM nginx:1.25.2-alpine
# Xóa cache để giảm kích thước container
RUN rm -rf /usr/share/nginx/html/*

# Sao chép build từ stage builder vào nginx container
COPY --from=builder /app/build /usr/share/nginx/html

# Expose cổng 80 (đây là cổng mặc định của nginx)
EXPOSE 5300

# Lệnh mặc định để khởi chạy nginx
CMD ["nginx", "-g", "daemon off;"]