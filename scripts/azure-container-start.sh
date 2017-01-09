#!/bin/sh

MONACO_GO_IMAGE="mohamedbana/monaco-go"
MONACO_GO_IMAGE_ID="${MONACO_GO_IMAGE}:latest"

echo "--------------"
echo ">    updating:" $MONACO_GO_IMAGE_ID
docker pull $MONACO_GO_IMAGE_ID
echo "<    updating:" $MONACO_GO_IMAGE_ID
echo "--------------"

# noop for now
MONACO_GO_CONTAINER_ID=$(docker ps | tail -n1 | cut -d ' ' -f 1)
echo "--------------"
echo ">         kill:" $MONACO_GO_CONTAINER_ID
# docker pull $MONACO_GO_IMAGE
echo "<         kill:" $MONACO_GO_CONTAINER_ID
echo "--------------"

# echo "--------------"
# echo ">     starting:" $MONACO_GO_IMAGE_ID
# docker run -p 8080:8080 -p 4389:4389 -it $MONACO_GO_IMAGE_ID
# echo "<     starting:" $MONACO_GO_IMAGE_ID
# echo "--------------"