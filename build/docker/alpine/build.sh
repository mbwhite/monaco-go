#!/bin/bash
# set -e

BUILD_CONTEXT=$(dirname "$0")

# find all folders that contain Dockerfile
IMAGES=$(ls -1 | xargs -I{} bash -c "[ -f '{}'/Dockerfile ] && echo '{}'")
# IMAGES=($IMAGE_FOLDERS)
# echo $IMAGE_FOLDERS
# echo $IMAGES
# echo ${IMAGES[@]}

GIT_REV=$(git rev-parse --short HEAD)
# IMAGE_TAG=$GIT_REV
IMAGE_TAG="latest"
IMAGE_NAME_PREFIX="mohamedbana"
IMAGE_NAME_PREFIX_TEST="t"
IMAGE_POSTFIX="alpine"

for IMAGE_FOLDER in $IMAGES
do
  echo ">>>>>>>>>>>>"
  IMAGE_NAME="$IMAGE_NAME_PREFIX/$IMAGE_FOLDER"
  IMAGE_FULL_NAME="${IMAGE_NAME}_${IMAGE_POSTFIX}:$IMAGE_TAG"
  IMAGE_FULL_NAME_TEST="${IMAGE_NAME_PREFIX_TEST}_$IMAGE_FOLDER:$IMAGE_TAG"
  IMAGE_DOCKER_FILE="$BUILD_CONTEXT/$IMAGE_FOLDER/Dockerfile"

  echo "building $IMAGE_FULL_NAME"
  docker build \
    -t $IMAGE_FULL_NAME \
    -t $IMAGE_FULL_NAME_TEST \
    -f $IMAGE_DOCKER_FILE \
    .

  echo "< image: $IMAGE_FULL_NAME"
  echo "<<<<<<<<<<<<"
done