#!/bin/bash

IMAGE_NAME_PREFIX="mohamedbana"
IMAGE_TAG="latest"
IMAGE_NAMES="base-langserver base-go-langserver go-langserver monaco-go"


echo "---------"
echo "> pushing:" $IMAGE_NAMES "@" $IMAGE_NAME_PREFIX ":" $IMAGE_TAG

for IMAGE_NAME in $IMAGE_NAMES
  do
  IMAGE_REPO="${IMAGE_NAME_PREFIX}/${IMAGE_NAME}:${IMAGE_TAG}"
  echo ">   image:" $IMAGE_REPO
  docker push $IMAGE_REPO
  echo "<   image:" $IMAGE_REPO
done

echo "---------"
echo "< pushing:"

#     8  docker pull mohamedbana/go-langserver:latest
#     9  docker run -p 8080:8080 -p 4389:4389 -it monaco-go:latest
#    10  docker run -p 8080:8080 -p 4389:4389 -it mohamedbana/go-langserver:latest

# docker run -p 8080:8080 -p 4389:4389 -it mohamedbana/go-langserver:latest
