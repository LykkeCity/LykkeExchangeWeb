FROM ilagnev/alpine-nginx-lua
ARG build=./build
WORKDIR /usr/share/nginx/html
COPY $build .

ARG VERSION=1.0.0
ENV APP_VERSION=$VERSION

# Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf

# Copy a configuration file from the current directory
ADD nginx.conf /etc/nginx/

# RUN cd /etc/nginx/conf.d/
# COPY nginx.conf default.conf
