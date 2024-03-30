FROM nginx:1.25.4-alpine3.18
COPY ./app /usr/share/nginx/html
EXPOSE 80