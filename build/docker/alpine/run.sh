#!/bin/bash

CMD_SSH="ssh -o UserKnownHostsFile=/dev/null root@0.0.0.0 -p 2222"
echo ">>>>>>>>>>>>"
echo "ssh - user:root, pass:docker.io:
$CMD_SSH
"
echo "<<<<<<<<<<<<"

docker run \
	-it --rm \
	-p 2222:22 \
	t_monaco-go

# docker run \
# 	-d \
# 	-p 2222:22 \
# 	t_monaco-go