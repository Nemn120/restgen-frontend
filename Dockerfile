# Etapa de construcción
FROM node:22.13.1-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build-prod

# Etapa de runtime con un servidor ligero (Nginx)
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/restgen-frontend/browser/ ./
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

#
#> docker build -t restgen-frontend-prod .
#> docker run -it -p 8080:10000 --name restgen-frontend-prod-app restgen-frontend-prod
