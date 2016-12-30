#!/bin/sh -x

BASEDIR=$(dirname "$0")

$BASEDIR/build.sh

echo "---------"
echo "running:"
bundle exec jekyll serve
