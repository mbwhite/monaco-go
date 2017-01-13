#!/bin/bash

IMAGE_NAME_PREFIX="mohamedbana"
IMAGE_TAG="latest"
GIT_REV=$(git rev-parse --short HEAD)
IMAGE_NAMES="base-langserver base-go-langserver go-langserver"

echo "---------"
echo "> pushing:" $IMAGE_NAMES "@" $IMAGE_NAME_PREFIX ":" $IMAGE_TAG

for IMAGE_NAME in $IMAGE_NAMES
  do
  IMAGE_REPO="${IMAGE_NAME_PREFIX}/${IMAGE_NAME}:${IMAGE_TAG}"
  echo ">   image:" $IMAGE_REPO
  docker push $IMAGE_REPO
  echo "<   image:" $IMAGE_REPO
done

IMAGE_MONACO_GO_NAME="monaco-go"
IMAGE_MONACO_GO="${IMAGE_NAME_PREFIX}/${IMAGE_MONACO_GO_NAME}:${GIT_REV}"
echo ">   image:" $IMAGE_MONACO_GO
docker push $IMAGE_MONACO_GO
echo "<   image:" $IMAGE_MONACO_GO

echo "---------"
echo "< pushing:"

#     8  docker pull mohamedbana/go-langserver:latest
#     9  docker run -p 8080:8080 -p 4389:4389 -it monaco-go:latest
#    10  docker run -p 8080:8080 -p 4389:4389 -it mohamedbana/go-langserver:latest

# docker run -p 8080:8080 -p 4389:4389 -it mohamedbana/go-langserver:latest
