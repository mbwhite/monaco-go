#!/bin/bash

set -e errexit
set -o pipefail

# this is a map, basically. split on the :: to get the key's value.
declare -a PACKAGES
PACKAGES=(
    "types::"
    "jsonrpc::"
    "client::vscode-languageserver-types vscode-jsonrpc"
	"server::vscode-languageserver-types vscode-jsonrpc"
)

echo "---"

for index in "${PACKAGES[@]}"
do
    PACKAGE="${index%%::*}"
	DEPS="${index##*::}"
	echo "BUILDING: $PACKAGE, DEPS: $DEPS"

	# link all deps  for the package
	for DEP in $DEPS
	do
		(cd $PACKAGE && yarn link "$DEP")
	done

	# now build it
	(cd $PACKAGE && \
		yarn install && \
		yarn run compile && \
		(yarn link || (yarn unlink && yarn link)))

	echo "---"
done
