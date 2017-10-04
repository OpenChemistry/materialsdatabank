FROM node:6.11 as build
COPY ./client /client
RUN cd /client && npm install && npm run build

FROM nginx
COPY ./devops/docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /client/build/ /etc/nginx/html/
