# `monaco-go`

Go lang mode for [monaco-editor](https://github.com/Microsoft/monaco-editor). The implementation is mostly derived from
[monaco-css](https://github.com/Microsoft/monaco-css) but uses WebSocket as the transport to talk to the
[go-langserver](https://github.com/sourcegraph/go-langserver).

WIP but these are partly supported:

* `textDocumentSync`
* `hoverProvider`
* `definitionProvider`
* `referencesProvider`
* `documentSymbolProvider`
* <del>`workspaceSymbolProvider`</del>

## screenshot

![monaco-go-lsp](/images/monaco-go-lsp.png)

![find-references.png](/images/find-references.png)

![document-symbol.png](/images/document-symbol.png)

## build

### `Dockerfile`

Execute below to download repo, build and run using Docker:

```sh
( \
	wget -qO- https://raw.githubusercontent.com/mbana/monaco-go/master/build/get.sh | /bin/bash \
) && \
docker run -p 8080:8080 -it monaco-go:latest
```

### locally

or, although not ideal:

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

## launch

Use the ip address of the docker container, e.g., <http://localhost:8080>, to access the editor:

```sh
 ---> Running in 0476618bd115
 ---> 0129c3bf8f2f
Removing intermediate container 0476618bd115
Successfully built 0129c3bf8f2f
--------
docker run -p 8080:8080 -it monaco-go:b776277
docker run -p 8080:8080 -it monaco-go:latest
--------

> monaco-go@1.2.1 serve /root/monaco-go
> http-server -c-1 --utc -o

Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
  http://172.17.0.3:8080
Hit CTRL-C to stop the server
[Wed, 14 Dec 2016 10:30:08 GMT] "GET /" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:08 GMT] "GET /node_modules/monaco-editor-core/dev/vs/editor/editor.main.css" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:08 GMT] "GET /node_modules/monaco-editor-core/dev/vs/loader.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:09 GMT] "GET /node_modules/monaco-editor-core/dev/vs/editor/editor.main.nls.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:09 GMT] "GET /node_modules/monaco-editor-core/dev/vs/editor/editor.main.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:09 GMT] "GET /demo/fillers.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:09 GMT] "GET /demo/monaco-go.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:09 GMT] "GET /node_modules/monaco-languages/release/src/monaco.contribution.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:09 GMT] "GET /release/dev/monaco.contribution.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:09 GMT] "GET /node_modules/monaco-languages/release/src/go.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:09 GMT] "GET /release/dev/goMode.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:10 GMT] "GET /node_modules/monaco-editor-core/dev/vs/base/worker/workerMain.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:10 GMT] "GET /node_modules/vscode-languageclient/lib/main.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:10 GMT] "GET /out/fillers/vscode.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:10 GMT] "GET /node_modules/vscode-languageserver-types/lib/main.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Wed, 14 Dec 2016 10:30:10 GMT] "GET /node_modules/vscode-languageclient/node_modules/vscode-jsonrpc/lib/main.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
```

### `GOPATH` etc.

Adjust:

* `WORKSPACE_ROOT_PATH` in [./demo/monaco.go.js](https://github.com/mbana/monaco-go/blob/master/demo/monaco-go.js#L22).
* `ROOT_PATH` in [./src/fillers/vscode/monaco-workspace.ts#L54](https://github.com/mbana/monaco-go/blob/master/src/fillers/vscode/monaco-workspace.ts#L54).

### `go-langserver` and `jsonrpc2`

todo: need to make these custom-built versions appear in the `GOPATH`.

```sh
~/go/src/github.com/sourcegraph/go-langserver/langserver/cmd/langserver-antha $ (go install -x -v github.com/sourcegraph/go-langserver/langserver/cmd/langserver-antha && ls -lah `which langserver-antha` && langserver-antha -mode ws -trace )
```

## References

* [`monaco-editor`](https://github.com/Microsoft/monaco-editor).
* [`vscode-css-languageservice`](https://github.com/Microsoft/vscode-css-languageservice).
* [`monaco.d.ts`](https://github.com/Microsoft/monaco-css/blob/master/src/monaco.d.ts).
* [Visual Studio Code](https://github.com/Microsoft/vscode).

* `build`: [/build/README.md](/build/README.md).
* `Dockerfile`: [/build/docker/README.md](/build/docker/README.md).

## License

[MIT](https://github.com/Microsoft/monaco-css/blob/master/LICENSE.md)