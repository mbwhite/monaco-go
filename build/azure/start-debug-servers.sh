#!/bin/bash
set -e
set -a
shopt -s expand_aliases

CONTAINER_SERVER="nginx"
PORT_SSL="4433"
PORT_HTTP="8080"
PROTOCOLS="https http"
URLS="cloud.bana.io localhost"

alias list_running='docker ps -q --filter name=nginx'
alias list_all='docker ps -a -q --filter name=nginx'

echo ">>>>>>>>>>>>"
# netstat -nlp
( \
  docker kill $(list_running) || \
  docker rm $(list_all) || \
  true
)
sleep 5
# netstat -nlp
echo "<<<<<<<<<<<<"

echo ">>>>>>>>>>>>"
mkdir -p \
  $(pwd)/html/$PORT_HTTP \
  $(pwd)/html/$PORT_SSL

echo "test $PORT_HTTP" > $(pwd)/html/$PORT_HTTP/index.html
echo "test $PORT_SSL" > $(pwd)/html/$PORT_SSL/index.html

#HOST_IP="0.0.0.0:"

PORTS_CONT="-p ${HOST_IP}$PORT_SSL:443"
NAME_CONT="nginx-$PORT_SSL"
VOLS_CONT=$(echo "-v $(pwd)/html/$PORT_SSL:/usr/share/nginx/html:ro")
docker run -d --name $NAME_CONT $VOLS_CONT $PORTS_CONT $CONTAINER_SERVER

PORTS_CONT="-p ${HOST_IP}$PORT_HTTP:80"
NAME_CONT="nginx-$PORT_HTTP"
VOLS_CONT=$(echo "-v $(pwd)/html/$PORT_HTTP:/usr/share/nginx/html:ro")
docker run -d --name $NAME_CONT $VOLS_CONT $PORTS_CONT $CONTAINER_SERVER

# netstat -nlp
echo "<<<<<<<<<<<<"

echo ">>>>>>>>>>>>"
for PROTOCOL in $PROTOCOLS
do
  PORT="$PORT_HTTP"
	if [[ "$PROTOCOL" == "https" ]]; then
    PORT="$PORT_SSL"
  fi

  for URL in $URLS; do
    REQUEST_URL="$PROTOCOL://$URL:$PORT/"
    # curl -v $REQUEST_URL || true
    echo "REQUEST_URL: $REQUEST_URL"
    curl $REQUEST_URL || true
  done
done
echo "<<<<<<<<<<<<"