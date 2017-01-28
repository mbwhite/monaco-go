#!/bin/sh -x

GIT_REV=$(git rev-parse --short HEAD)
IMAGE_NAME_PREFIX="mohamedbana"

# echo "--------"
# IMAGE_MONACO_GO_FOLDER="monaco-go"
# IMAGE_MONACO_GO_NAME="$IMAGE_NAME_PREFIX/$IMAGE_MONACO_GO_FOLDER"
# # IMAGE_MONACO_GO_LATEST="$IMAGE_MONACO_GO_NAME:latest"
# IMAGE_MONACO_GO_GIT_REV="$IMAGE_MONACO_GO_NAME:${GIT_REV}"
# echo "> image:" "$IMAGE_MONACO_GO_NAME @ $IMAGE_MONACO_GO_GIT_REV"

# docker build \
#   -t $IMAGE_MONACO_GO_GIT_REV \
#   -f ./build/docker/${IMAGE_MONACO_GO_FOLDER}/Dockerfile \
#   .
# echo "< image:" "$IMAGE_MONACO_GO_NAME @ $IMAGE_MONACO_GO_GIT_REV"
# echo "--------"

echo "--------"
IMAGE_FOLDER="nginx-monaco-go"
IMAGE_NAME="${IMAGE_NAME_PREFIX}/${IMAGE_FOLDER}"
docker build \
  -t "${IMAGE_NAME}:${GIT_REV}" \
  -f ./build/docker/${IMAGE_FOLDER}/Dockerfile \
  .
echo "< image:" "$IMAGE_NAME:$GIT_REV"
echo "< image:" "$IMAGE_NAME:latest"
echo "--------"
