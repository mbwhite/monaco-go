#!/bin/sh

# hack to invalidate Docker cache
touch README.md

REPO_NAME=$(basename `git rev-parse --show-toplevel`)
GIT_REV=$(git rev-parse --short HEAD)

IMAGE_NAME_REV="$REPO_NAME:$GIT_REV"
IMAGE_NAME_LATEST="$REPO_NAME:latest"

docker build \
  -t $IMAGE_NAME_REV \
  -t $IMAGE_NAME_LATEST \
  -f ./build/docker/Dockerfile \
  .

echo "--------"
echo "run commands:"
echo "docker run -p 8080:8080 -it $IMAGE_NAME_REV"
echo "docker run -p 8080:8080 -it $IMAGE_NAME_LATEST"
echo "--------"

# docker run -p 8080:8080 -it $IMAGE_NAME_LATEST
