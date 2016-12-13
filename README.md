# `monaco-go`

The implementation is mostly derived from [monaco-css](https://github.com/Microsoft/monaco-css) but uses WebSocket as the transport to talk to the [go-langserver](https://github.com/sourcegraph/go-langserver).

## screenshot

![monaco-go-lsp](/images/monaco-go-lsp.png)

![find-references.png](/images/find-references.png)

![document-symbol.png](/images/document-symbol.png)

## build

### `monaco-go`

The browser will launch at the address http://127.0.0.1:8080/ once the build is done.

```sh
wget -qO- https://raw.githubusercontent.com/mbana/monaco-go/master/build/get.sh | /bin/sh
```
or

```sh
( \
  REPOS_DIR="/tmp/repos/ghub" && \
  mkdir -p $REPOS_DIR && \
  cd $REPOS_DIR && \
  git clone --recursive git@github.com:mbana/monaco-go.git && \
  cd monaco-go && \
  ./build/all.sh \
)
```

### `go-langserver` and `jsonrpc2`

todo: need to make these custom-built versions appear in the `GOPATH`.

### docs

* `build`: [/build/README.md](/build/README.md).
* `Dockerfile`: [/build/docker/README.md](/build/docker/README.md).

---

# Monaco CSS

CSS language plugin for the Monaco Editor. It provides the following features when editing CSS, LESS and SCSS files:
* Code completion
* Hovers
* Validation: Syntax errors and linting
* Find definition, references & highlights for symbols in the same file
* Document Symbols

Linting an be configured through the API. See [here](https://github.com/Microsoft/monaco-css/blob/master/src/monaco.d.ts) for the API that the
CSS plugin offers to configure the CSS/LESS/SCSS language support.

Internally the CSS plugin uses the [vscode-css-languageservice](https://github.com/Microsoft/vscode-css-languageservice)
node module, providing the implementation of the functionally listed above. The same module is also used
in [Visual Studio Code](https://github.com/Microsoft/vscode) to power the CSS, LESS and SCSS editing experience.

## Issues

Please file issues concering `monaco-css` in the [`monaco-editor` repository](https://github.com/Microsoft/monaco-editor/issues).

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

## Development

* `git clone https://github.com/Microsoft/monaco-css`
* `cd monaco-css`
* `npm install .`
* `npm run watch`
* open `$/monaco-css/test/index.html` in your favorite browser.

## License
[MIT](https://github.com/Microsoft/monaco-css/blob/master/LICENSE.md)