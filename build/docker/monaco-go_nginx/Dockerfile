FROM nginx:1.10-alpine

ENV PID_FILE="/var/run/nginx.pid"
ENV DIR_LOG="/var/log/nginx"
ENV DIR_HTML="/var/www/html/cloud.bana.io"
ENV DIR_CERTS="/etc/nginx/certs/cloud.bana.io"

RUN \
  mkdir -p /var/run && \
  touch $PID_FILE && \
  mkdir -p $DIR_LOG && \
  touch $DIR_LOG/error.log && \
  touch $DIR_LOG/access.log && \
  mkdir -p $DIR_HTML && \
  mkdir -p $DIR_CERTS

# >>>>>>>>>>>>
# Expose ports
EXPOSE 80 443
# <<<<<<<<<<<<

ADD ./build/nginx/nginx.conf /etc/nginx/nginx.conf
ADD ./build/docker/monaco-go_nginx/docker-entrypoint.sh /docker-entrypoint.sh
RUN \
  chmod +x /docker-entrypoint.sh

# https://github.com/docker-library/redis/tree/master/3.0/alpine
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD [ "nginx" ]

# docs
# https://github.com/macropin/docker-sshd/blob/master/Dockerfile
# https://github.com/smebberson/docker-alpine/tree/master/alpine-nginx