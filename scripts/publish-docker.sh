#!/bin/bash

IMAGE_NAME_PREFIX="mohamedbana"

# the tags to use when publishing the image
IMAGE_TAG_LATEST="latest"
IMAGE_TAG_GIT_REV=$(git rev-parse --short HEAD)

# list of images to publish
IMAGE_NAMES_TAGS_NONE="base-langserver base-go-langserver"
IMAGE_NAMES_TAGS_CONTAINS="go-langserver monaco-go"

echo "---------"
echo "> pushing:" $IMAGE_NAMES_TAGS_NONE "@" $IMAGE_NAME_PREFIX ":" $IMAGE_TAG_LATEST
echo "> pushing:" $IMAGE_NAMES_TAGS_CONTAINS "@" $IMAGE_NAME_PREFIX ":" $IMAGE_TAG_GIT_REV

for IMAGE_TAG_NONE_NAME in $IMAGE_NAMES_TAGS_NONE
  do
  IMAGE_TAG_NONE_REPO="${IMAGE_NAME_PREFIX}/${IMAGE_TAG_NONE_NAME}:${IMAGE_TAG_LATEST}"
  echo ">   image:" $IMAGE_TAG_NONE_REPO
  docker push $IMAGE_TAG_NONE_REPO
  echo "<   image:" $IMAGE_TAG_NONE_REPO
done

for IMAGE_TAG_CONTAINS_NAME in $IMAGE_NAMES_TAGS_CONTAINS
  do
  IMAGE_TAG_CONTAINS_REPO="${IMAGE_NAME_PREFIX}/${IMAGE_TAG_CONTAINS_NAME}:${IMAGE_TAG_GIT_REV}"
  echo ">   image:" $IMAGE_TAG_CONTAINS_REPO
  docker push $IMAGE_TAG_CONTAINS_REPO
  echo "<   image:" $IMAGE_TAG_CONTAINS_REPO
done

echo "---------"
echo "< pushing:"

#     8  docker pull mohamedbana/go-langserver:latest
#     9  docker run -p 8080:8080 -p 4389:4389 -it monaco-go:latest
#    10  docker run -p 8080:8080 -p 4389:4389 -it mohamedbana/go-langserver:latest

# docker run -p 8080:8080 -p 4389:4389 -it mohamedbana/go-langserver:latest
