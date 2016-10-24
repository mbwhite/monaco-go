# Monaco go

<del>
CSS language plugin for the Monaco Editor. It provides the following features when editing CSS, LESS and SCSS files:
* Code completion
* Hovers
* Validation: Syntax errors and linting
* Find definition, references & highlights for symbols in the same file
* Document Symbols
</del>

<del>
Linting an be configured through the API. See [here](https://github.com/Microsoft/monaco-go/blob/master/src/monaco.d.ts) for the API that the
CSS plugin offers to configure the CSS/LESS/SCSS language support.
</del>

<del>
Internally the CSS plugin uses the [vscode-go-languageservice](https://github.com/Microsoft/vscode-go-languageservice)
node module, providing the implementation of the functionally listed above. The same module is also used
in [Visual Studio Code](https://github.com/Microsoft/vscode) to power the CSS, LESS and SCSS editing experience.
</del>

## Issues

<del>
Please file issues concering `monaco-go` in the [`monaco-editor` repository](https://github.com/Microsoft/monaco-editor/issues).
</del>

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

## Development

See:

* [scripts/install.sh](scripts/install.sh).
* [scripts/open.sh](scripts/open.sh).
* Requires [vscode-go-languageservice](https://github.com/mbana/vscode-go-languageservice).

---

```sh
#!/bin/sh -x

DEPTH="--depth 1"
REPOS="vscode-go-languageservice monaco-go"
for REPO in $REPOS
do
    git clone $DEPTH git@github.com:mbana/$REPO.git
done

cd vscode-go-languageservice && \
	npm install && \
	sudo npm link && \
	cd ..

# the line npm install ../vscode-go-languageservice -f
# is required...
cd monaco-go && \
	npm link vscode-go-languageservice && \
	npm install ../vscode-go-languageservice -f -S && \
	npm install && \
	npm run watch

```

```sh
#!/bin/bash -x

TEST_FILE=$([[ -e "./test/index.html" ]] && echo "./test/index.html" || echo "monaco-go/test/index.html")

OS_TYPE=$(echo $OSTYPE)
case $OS_TYPE in
  darwin*)  open $TEST_FILE ;;
  linux*)   xdg-open $TEST_FILE ;;
  *)        echo "unknown: ${OS_TYPE}" ;;
esac
```

## License
[MIT](https://github.com/Microsoft/monaco-go/blob/master/LICENSE.md)
