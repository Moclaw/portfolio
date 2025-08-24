# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Define build argument
ARG VITE_API_URL=https://api.moclawr.com

# Set environment variable
ENV VITE_API_URL=${VITE_API_URL}

# Cài đặt dependencies
COPY package.json .
# Remove any existing lock files to avoid native dependency issues
RUN rm -f package-lock.json
RUN npm cache clean --force
RUN npm install --force
COPY . .
# Remove node_modules and reinstall to fix Rollup native dependency issue
RUN rm -rf node_modules package-lock.json
RUN npm install --force
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runner

# Copy built files vào thư mục public của nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy cấu hình Nginx tùy chỉnh để handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mặc định Nginx chạy trên cổng 80, bạn có thể map ra ngoài 5300 khi chạy container
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
