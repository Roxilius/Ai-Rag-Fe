# Stage 1: Build React Vite pakai pnpm
FROM node:20-alpine AS build

# Set workdir di container
WORKDIR /app

# Install pnpm global
RUN npm install -g pnpm@8.12.1

# Copy file package.json & pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies tanpa modifikasi lockfile
RUN pnpm install --frozen-lockfile

# Copy semua file project
COPY . .

# Build project
RUN pnpm run build

# Stage 2: Serve dengan Nginx
FROM nginx:alpine

# Hapus konfigurasi default nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy konfigurasi nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari stage 1 ke folder nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]