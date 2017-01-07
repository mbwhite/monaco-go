#!/bin/sh -x

# do the push then try running it
docker tag monaco-go:latest mohamedbana/go-langserver:latest
docker push mohamedbana/go-langserver:latest

# docker run -p 8080:8080 -p 4389:4389 -it mohamedbana/go-langserver:latest

#docker tag monaco-go:f8909f4 mohamedbana/go-langserver:f8909f4
# docker push mohamedbana/go-langserver:f8909f4
