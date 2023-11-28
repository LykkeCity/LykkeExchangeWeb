FROM node:18 as builder
#args
ARG GITHUB_REGISTRY_TOKEN
ARG REACT_APP_API_URL
ARG REACT_APP_APIV1_URL
ARG REACT_APP_AUTH_URL
ARG REACT_APP_CALLBACK_URL
ARG REACT_APP_CLIENT_ID
ARG REACT_APP_TRADE_URL
ARG REACT_APP_WAMP_REALM
ARG REACT_APP_WAMP_URL
ARG REACT_APP_WEBWALLET_URL
#envs
ENV GITHUB_TOKEN ${GITHUB_REGISTRY_TOKEN}
ENV REACT_APP_API_URL ${REACT_APP_API_URL}
ENV REACT_APP_APIV1_URL ${REACT_APP_APIV1_URL}
ENV REACT_APP_AUTH_URL ${REACT_APP_AUTH_URL}
ENV REACT_APP_CALLBACK_URL ${REACT_APP_CALLBACK_URL}
ENV REACT_APP_CLIENT_ID ${REACT_APP_CLIENT_ID}
ENV REACT_APP_TRADE_URL ${REACT_APP_TRADE_URL}
ENV REACT_APP_WAMP_REALM ${REACT_APP_WAMP_REALM}
ENV REACT_APP_WAMP_URL ${REACT_APP_WAMP_URL}
ENV REACT_APP_WEBWALLET_URL ${REACT_APP_WEBWALLET_URL}

RUN echo ${REACT_APP_API_URL}

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
