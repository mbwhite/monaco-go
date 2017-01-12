#!/bin/sh

BASEDIR=$(dirname "$0")


echo "--------"
IMAGE_NAME_PREFIX="mohamedbana"
REPO_NAME=$(basename `git rev-parse --show-toplevel`)
GIT_REV=$(git rev-parse --short HEAD)
echo " prefix:" $IMAGE_NAME_PREFIX
echo "   repo:" $REPO_NAME
echo "    rev:" $GIT_REV
echo "--------"

echo "--------"
IMAGE_BASE_FOLDER="base-langserver"
IMAGE_BASE_NAME="$IMAGE_NAME_PREFIX/$IMAGE_BASE_FOLDER"
IMAGE_BASE_LATEST="$IMAGE_BASE_NAME:latest"
# only build the latest one for now
# docker build \
#   -t $IMAGE_BASE_REV \
#   -t $IMAGE_BASE_LATEST \
#   -f ./build/docker/${IMAGE_BASE_FOLDER}/Dockerfile \
#   .
echo "> image:" "$IMAGE_BASE_NAME @ $IMAGE_BASE_LATEST"

docker build \
  -t $IMAGE_BASE_LATEST \
  -f ./build/docker/${IMAGE_BASE_FOLDER}/Dockerfile \
  .
echo "< image:" "$IMAGE_BASE_NAME @ $IMAGE_BASE_LATEST"
echo "--------"


echo "--------"
IMAGE_BASE_GO_LANGSERVER_FOLDER="base-go-langserver"
IMAGE_BASE_GO_LANGSERVER_NAME="$IMAGE_NAME_PREFIX/$IMAGE_BASE_GO_LANGSERVER_FOLDER"
IMAGE_BASE_GO_LANGSERVER_LATEST="$IMAGE_BASE_GO_LANGSERVER_NAME:latest"
echo "> image:" "$IMAGE_BASE_GO_LANGSERVER_NAME @ $IMAGE_BASE_GO_LANGSERVER_LATEST"

docker build \
  -t $IMAGE_BASE_GO_LANGSERVER_LATEST \
  -f ./build/docker/${IMAGE_BASE_GO_LANGSERVER_FOLDER}/Dockerfile \
  .
echo "< image:" "$IMAGE_BASE_GO_LANGSERVER_NAME @ $IMAGE_BASE_GO_LANGSERVER_LATEST"
echo "--------"


echo "--------"
IMAGE_GO_LANGSERVER_FOLDER="go-langserver"
IMAGE_GO_LANGSERVER_NAME="$IMAGE_NAME_PREFIX/$IMAGE_GO_LANGSERVER_FOLDER"
# IMAGE_GO_LANGSERVER_REV="$IMAGE_GO_LANGSERVER_NAME:$GIT_REV"
IMAGE_GO_LANGSERVER_LATEST="$IMAGE_GO_LANGSERVER_NAME:latest"
echo "> image:" "$IMAGE_GO_LANGSERVER_NAME @ $IMAGE_GO_LANGSERVER_LATEST"

docker build \
  -t $IMAGE_GO_LANGSERVER_LATEST \
  -f ./build/docker/${IMAGE_GO_LANGSERVER_FOLDER}/Dockerfile \
  .
echo "< image:" "$IMAGE_GO_LANGSERVER_NAME @ $IMAGE_GO_LANGSERVER_LATEST"
echo "--------"


echo "--------"
IMAGE_MONACO_GO_FOLDER="monaco-go"
IMAGE_MONACO_GO_NAME="$IMAGE_NAME_PREFIX/$IMAGE_MONACO_GO_FOLDER"
# IMAGE_MONACO_GO_LATEST="$IMAGE_MONACO_GO_NAME:latest"
IMAGE_MONACO_GO_GIT_REV="$IMAGE_MONACO_GO_NAME:${GIT_REV}"
echo "> image:" "$IMAGE_MONACO_GO_NAME @ $IMAGE_MONACO_GO_GIT_REV"

docker build \
  -t $IMAGE_MONACO_GO_GIT_REV \
  -f ./build/docker/${IMAGE_MONACO_GO_FOLDER}/Dockerfile \
  .
echo "< image:" "$IMAGE_MONACO_GO_NAME @ $IMAGE_MONACO_GO_GIT_REV"
echo "--------"


echo "--------"
echo "run cmds:"
echo "docker run -p 8080:8080 -p 4389:4389 -it $IMAGE_MONACO_GO_GIT_REV"
echo "--------"