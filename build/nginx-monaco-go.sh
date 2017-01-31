#!/bin/bash

GIT_REV=$(git rev-parse --short HEAD)
IMAGE_NAME_PREFIX="mohamedbana"
DOCKER_RUN_CMD="docker run -it"

# echo "--------"
# IMAGE_MONACO_GO_FOLDER="monaco-go"
# IMAGE_MONACO_GO_NAME="$IMAGE_NAME_PREFIX/$IMAGE_MONACO_GO_FOLDER"
# IMAGE_MONACO_GO_TAG="$IMAGE_MONACO_GO_NAME:$GIT_REV"
# echo "> image:" "$IMAGE_MONACO_GO_TAG"

# docker build \
#   -t $IMAGE_MONACO_GO_TAG \
#   -f ./build/docker/$IMAGE_MONACO_GO_FOLDER/Dockerfile \
#   .

# echo "
# < image: $IMAGE_MONACO_GO_TAG"
# echo "--------"

echo "--------"
IMAGE_NGINX_FOLDER="nginx-monaco-go"
IMAGE_NGINX_NAME="$IMAGE_NAME_PREFIX/$IMAGE_NGINX_FOLDER"
IMAGE_NGINX_TAG="$IMAGE_NGINX_NAME:$GIT_REV"

docker build \
  -t $IMAGE_NGINX_TAG \
  -f ./build/docker/$IMAGE_NGINX_FOLDER/Dockerfile \
  .

echo "
< image: $IMAGE_NGINX_TAG
<   run:
$DOCKER_RUN_CMD $IMAGE_NGINX_TAG"
echo "--------"
