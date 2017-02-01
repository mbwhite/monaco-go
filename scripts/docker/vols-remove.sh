#!/bin/bash -e

echo ">>>>>>>>>>>>"
echo "vols stale"

STALE_VOLS=$(docker volume ls -q -f dangling=true)
[[ ! -z $STALE_VOLS ]] && \
  docker volume rm $STALE_VOLS

echo "images stale"
STALE_IMGS=$(docker images --filter "dangling=true" -q --no-trunc)
STALE_CONTAINERS=$(docker ps -a --filter 'status=exited' -q --no-trunc)

[[ ! -z $STALE_IMGS ]] && \
  echo "docker rmi: $STALE_IMGS" && \
  docker rmi $STALE_IMGS

[[ ! -z $STALE_CONTAINERS ]] && \
  echo "docker rm: $STALE_CONTAINERS" && \
  docker rm $STALE_CONTAINERS

echo "<<<<<<<<<<<<"
echo ""