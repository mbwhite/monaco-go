#!/bin/sh -x

# run from within azure

# pull latest then run it
docker ps
docker pull mohamedbana/go-langserver:latest
docker run -p 8080:8080 -p 4389:4389 -it mohamedbana/go-langserver:latest