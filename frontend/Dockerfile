# FROM node:20-alpine
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

RUN npm run build

FROM nginx:latest
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3000
# 80 포트 오픈
# EXPOSE 80

# container 실행 시 자동으로 실행할 command. nginx 시작함
CMD ["nginx", "-g", "daemon off;"]