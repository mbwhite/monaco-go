#!/bin/sh
set -e

( \
  ls -lah /Users/mbana && \
  ls -lah /Users/mbana/monaco-go && \
  ln -s /Users/mbana/monaco-go /var/www/html/cloud.bana.io/monaco-go \
)

( \
	LOGS_NGINX="/var/www/html/cloud.bana.io/logs/nginx" && \
	mkdir -p $LOGS_NGINX && \
	cd $LOGS_NGINX && \
	ln -s /var/log/nginx/error.log error.log && \
  ln -s /var/log/nginx/access.log access.log \
)

( \
	LOGS_LANGSERVER="/var/www/html/cloud.bana.io/logs/go-lanserver" && \
	mkdir -p $LOGS_LANGSERVER && \
	cd $LOGS_LANGSERVER && \
	ln -s /Users/mbana/monaco-go/go-langserver.log go-langserver.log \
)

if [ "$1" == 'nginx' ]; then
	# exec gosu redis "$@"
	exec nginx
fi

exec "$@"
