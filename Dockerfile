# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# ---------- Runtime (unprivileged NGINX) ----------
# Port 8080 by default; runs as 101:101 internally
FROM nginxinc/nginx-unprivileged:1.27-alpine

# Optional: patch OS packages if scanner still flags anything
RUN apk --no-cache upgrade

COPY --chown=101:101 --from=build /app/dist /usr/share/nginx/html

# SPA fallback
RUN printf 'server {\n  listen 8080;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]