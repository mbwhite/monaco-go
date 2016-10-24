#!/bin/sh -x

DEPTH="--depth 1"
REPOS="vscode-go-languageservice monaco-go"
for REPO in $REPOS
do
    git clone $DEPTH git@github.com:mbana/$REPO.git
done

cd vscode-go-languageservice && \
	npm install && \
	sudo npm link && \
	cd ..

# the line npm install ../vscode-go-languageservice -f
# is required...
cd monaco-go && \
	npm link vscode-go-languageservice && \
	npm install ../vscode-go-languageservice -f -S && \
	npm install && \
	npm run watch

