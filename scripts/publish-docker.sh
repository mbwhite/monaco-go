#!/bin/sh -x

# do the push then try running it
docker tag monaco-go:latest mohamedbana/go-langserver:latest
docker push mohamedbana/go-langserver:latest

#     8  docker pull mohamedbana/go-langserver:latest
#     9  docker run -p 8080:8080 -p 4389:4389 -it monaco-go:latest
#    10  docker run -p 8080:8080 -p 4389:4389 -it mohamedbana/go-langserver:latest

# docker run -p 8080:8080 -p 4389:4389 -it mohamedbana/go-langserver:latest
