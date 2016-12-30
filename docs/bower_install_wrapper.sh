#!/bin/sh

BOWER_BIN=`find . -path "*/bin/bower" -not -path "*/_site/*" | head -n1`
BOWER_ARGS="install --save"
DEP_NAME_PREVIEW_POSTFIX="#2.0-preview"

# something like "PolymerElements/iron-flex-layout"
DEP_ORG_NAME=$1
DEP_COMP_NAME=$2
DEP_NAME="$DEP_ORG_NAME/$DEP_COMP_NAME"
DEP_NAME_PREVIEW="$DEP_NAME$DEP_NAME_PREVIEW_POSTFIX"
echo $DEP_NAME_PREVIEW

echo "$BOWER_BIN"
$BOWER_BIN $BOWER_ARGS $DEP_NAME_PREVIEW

DEP_MAIN_INCLUDE="*/$DEP_COMP_NAME/$DEP_COMP_NAME.html"
DEP_MAIN_INCLUDE_LOCATION=`find * -type f -path $DEP_MAIN_INCLUDE -not -path "*/_site/*" -print0`

echo "--------"
echo " import as or paste:"
IMPORT_STATEMENT="		<link rel=\"import\" href=\"$DEP_MAIN_INCLUDE_LOCATION\">"
echo "$IMPORT_STATEMENT"
echo "$IMPORT_STATEMENT" | pbcopy
