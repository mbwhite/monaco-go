#!/bin/sh -x

echo "---------"
echo "serving:"
bundle install
bundle exec jekyll serve