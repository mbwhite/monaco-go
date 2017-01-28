FROM mohamedbana/monaco-go:3a1dd25
# FROM mohamedbana/monaco-go:latest

# https://github.com/dockerfile/nginx/blob/master/Dockerfile

# Install Nginx.
RUN \
  add-apt-repository -y ppa:nginx/stable && \
  apt-get update && \
  apt-get install -y nginx && \
  rm -rf /var/lib/apt/lists/* && \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx

# verify it has http/2 and version is the one i tested under
RUN \
  nginx -V 2>&1 | grep 'http_v2'; \
  nginx -v | grep 'nginx/1.10.2'; \
  exit 0

RUN \
	mkdir -p /var/log/nginx/cloud.bana.io && \
	mkdir -p /etc/nginx/certs/cloud.bana.io && \
	mkdir -p /var/www/html/cloud.bana.io && \
	cd /var/www/html/cloud.bana.io && \
	ln -s $HOME/monaco-go monaco-go && \
	ls -lah && \
	ls -lah monaco-go

# Define mountable directories.
VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]
# VOLUME [\
# 	"/etc/nginx/sites-enabled", \
# 	"/etc/nginx/certs", \
# 	"/etc/nginx/conf.d", \
# 	"/var/log/nginx", \
# 	"/var/www/html" \
# ]

# Define working directory.
# WORKDIR /etc/nginx

# Expose ports.
EXPOSE 80
EXPOSE 443
EXPOSE 4389

RUN \
  chmod +x /docker-entrypoint-nginx.sh; \
  ls -lah /docker-entrypoint-nginx.sh
COPY ./build/docker/docker-entrypoint.sh /

CMD ["/docker-entrypoint.sh"]