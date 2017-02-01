#!/bin/bash
set -e
set -a

# usage:
# ~/dev/vscode/mbana/monaco-go $ source ./scripts/utils.sh .
# $ echo $BUILD_NGINX $START_NGINX
# ./build/docker/nginx-monaco-go.sh ./scripts/nginx-docker.sh

# START_NGINX="./$(realpath --relative-to=`pwd` /Users/mbana/dev/vscode/mbana/monaco-go/scripts/nginx-docker.sh)"
START_NGINX=$(find . -name nginx-docker.sh)

# BUILD_NGINX="./$(realpath --relative-to=`pwd` /Users/mbana/dev/vscode/mbana/monaco-go/build/docker/nginx-monaco-go.sh)"
BUILD_NGINX=$(find . -name nginx-monaco-go.sh)