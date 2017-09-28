FROM nginx
ARG build=./build
WORKDIR /usr/share/nginx/html
COPY $build .
