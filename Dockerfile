# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Define build argument
ARG VITE_API_URL=https://api.moclawr.com

# Set environment variable
ENV VITE_API_URL=${VITE_API_URL}

# Cài đặt dependencies
COPY package.json .
RUN npm install --force
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runner

# Copy built files vào thư mục public của nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy cấu hình Nginx tùy chỉnh (nếu có)
# COPY nginx.conf /etc/nginx/nginx.conf

# Mặc định Nginx chạy trên cổng 80, bạn có thể map ra ngoài 5300 khi chạy container
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
