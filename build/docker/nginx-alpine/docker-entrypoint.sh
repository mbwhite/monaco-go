#!/bin/sh
set -ex

ls -lah  /Users/mbana
ls -lah  /Users/mbana/monaco-go
ln -s /Users/mbana/monaco-go /var/www/html/cloud.bana.io/monaco-go

if [ "$1" == 'nginx' ]; then
	# exec gosu redis "$@"
	exec nginx
fi

exec "$@"