#!/bin/sh

MONACO_GO_IMAGE="mohamedbana/go-langserver"
echo "---------------"
echo "updating"
echo "$MONACO_GO_IMAGE:"

docker pull $MONACO_GO_IMAGE:latest
echo "---------------"


MONACO_GO_ID=$(docker ps | tail -n1 | cut -d ' ' -f 1)
echo "---------------"
echo "starting"
echo "$MONACO_GO_IMAGE:"
echo "             MONACO_GO_ID: " $MONACO_GO_ID

docker kill $MONACO_GO_ID
docker run -p 8080:8080 -p 4389:4389 -it $MONACO_GO_IMAGE:latest
echo "---------------"