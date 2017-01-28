#!/bin/bash

set -e -o pipefail
trap 'jobs -p | xargs kill' EXIT

tail -f /var/log/nginx/cloud.bana.io/error.log  /var/log/nginx/cloud.bana.io/access.log &

echo "==> sudo nginx <=="
sudo nginx