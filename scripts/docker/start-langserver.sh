#!/bin/bash -e

exec 3>&2 2>&1 1>&3

echo ">>>>>>>>>>>>"
echo "start $IMG_LANGSERVER"

IMG_PORTS="-p 4389:4389 -p 22"
IMG_VOLS="\
-v $IMG_VOL_SHARED:$IMG_VOL_HOST_PATH"

ID_LANGSERVER=$(docker run -d $IMG_PORTS $IMG_VOLS --name $IMG_ALIAS_LANGSERVER $IMG_LANGSERVER)
sleep 5

echo >&2 $(echo $ID_LANGSERVER)
echo "<<<<<<<<<<<<"
echo ""