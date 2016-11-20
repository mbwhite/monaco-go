#!/bin/sh -x

REPOS="vscode-go-languageservice monaco-go"

echo "---"
echo "INSTALLING ${REPOS}"

DEPTH="--depth 1"
for REPO in $REPOS; do
	(git clone $DEPTH git@github.com:mbana/$REPO.git && \
		cd $REPO && \
		yarn install)
done

echo "---"