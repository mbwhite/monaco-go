#!/bin/bash
set -e
set -a

# usage:
# ~/dev/vscode/mbana/monaco-go $ source ./scripts/utils.sh .
# $ echo $BUILD_NGINX $START_NGINX
# ./build/docker/nginx-monaco-go.sh ./scripts/nginx-docker.sh

START_NGINX=$(find . -name nginx-docker.sh)
BUILD_NGINX=$(find . -name monaco-go_go-langserver.sh)
