#!/bin/sh -x

BASEDIR=$(dirname "$0")

$BASEDIR/build.sh

ln -s /Users ./_site/Users

echo "---------"
echo "running:"
bundle exec jekyll serve
