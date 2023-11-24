FROM node:18 as builder

ARG GITHUB_REGISTRY_TOKEN
ENV GITHUB_TOKEN ${GITHUB_REGISTRY_TOKEN}

COPY . /app
WORKDIR /app
RUN chmod +x configure-npm.sh && ./configure-npm.sh
RUN yarn install
RUN yarn build

FROM ilagnev/alpine-nginx-lua

ARG VERSION=1.0.0
ENV APP_VERSION=$VERSION

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build/ /usr/share/nginx/html
# Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf

# Copy a configuration file from the current directory
ADD nginx.conf /etc/nginx/
