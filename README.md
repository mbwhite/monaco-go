# `monaco-go`

Go lang mode for [monaco-editor](https://github.com/Microsoft/monaco-editor). The implementation is mostly derived from
[monaco-css](https://github.com/Microsoft/monaco-css) but uses WebSocket as the transport to talk to the
[go-langserver](https://github.com/sourcegraph/go-langserver).

WIP but these are partly supported:

* `textDocumentSync`
* `hoverProvider`
* `definitionProvider`: going to definition works but navigating back and
forths isn't.
* `referencesProvider`: references are listed, navigating to them however isn't.
* `textDocument/publishDiagnostics`.
* `documentSymbolProvider`: wip.
* <del>`workspaceSymbolProvider`</del>

## screenshot

![monaco-go-lsp](/images/monaco-go-lsp.png)

![find-references.png](/images/find-references.png)

![document-symbol.png](/images/document-symbol.png)

![publish-diagnostics.png](/images/publish-diagnostics.png)


## build

### `Dockerfile`

Execute below to download repo, build and run using Docker:

```sh
( \
	wget -qO- https://raw.githubusercontent.com/mbana/monaco-go/master/build/get.sh | /bin/bash \
) && \
docker run -p 8080:8080 -it monaco-go:latest
```

See [build output](#build-output) for what logs you should expect to see.

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

### build output

The langserver and server hosting monaco should log something, after which
you should access <http://localhost:8080>. The lines which
indicate that connection has been made are the last ones:

```sh
Removing intermediate container a0155ffa6334
Successfully built 467d10dc618e
--------
run commands:
docker run -p 8080:8080 -p 4389:4389 -it monaco-go:855a815
docker run -p 8080:8080 -p 4389:4389 -it monaco-go:latest
~/dev/vscode/mbana/monaco-go $ docker run -p 8080:8080 -p 4389:4389 -it monaco-go:latest
langserver: websocket listening on: :4389

> monaco-go@1.2.1 serve /root/monaco-go
> http-server -c-1 --utc -o

Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
  http://172.17.0.3:8080
Hit CTRL-C to stop the server
[Thu, 15 Dec 2016 01:38:38 GMT] "GET /" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:38 GMT] "GET /node_modules/monaco-editor-core/dev/vs/editor/editor.main.css" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:38 GMT] "GET /node_modules/monaco-editor-core/dev/vs/loader.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:38 GMT] "GET /node_modules/monaco-editor-core/dev/vs/editor/editor.main.nls.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:38 GMT] "GET /node_modules/monaco-editor-core/dev/vs/editor/editor.main.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:38 GMT] "GET /demo/monaco-go.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:38 GMT] "GET /demo/fillers.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:39 GMT] "GET /node_modules/monaco-languages/release/src/monaco.contribution.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:39 GMT] "GET /release/dev/monaco.contribution.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:39 GMT] "GET /node_modules/monaco-languages/release/src/go.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:39 GMT] "GET /release/dev/goMode.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:39 GMT] "GET /node_modules/monaco-editor-core/dev/vs/base/worker/workerMain.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:39 GMT] "GET /node_modules/vscode-languageclient/lib/main.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:40 GMT] "GET /out/fillers/vscode.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:40 GMT] "GET /node_modules/vscode-languageserver-types/lib/main.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:40 GMT] "GET /node_modules/vscode-languageclient/node_modules/vscode-jsonrpc/lib/main.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:40 GMT] "GET /out/fillers/vscode/monaco-window.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:40 GMT] "GET /out/fillers/vscode/monaco-languages.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:40 GMT] "GET /out/fillers/vscode/monaco-workspace.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:40 GMT] "GET /out/fillers/vscode/monaco-text-document.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:40 GMT] "GET /out/fillers/vscode/monaco-output-channel.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
[Thu, 15 Dec 2016 01:38:40 GMT] "GET /out/fillers/vscode/monaco-position.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
langserver-go: wsConn upgrading - w: 0xc4200619f0, r: 0xc4200ea0f0
langserver: wsConn: 0xc420077440 - upgraded - w: 0xc4200619f0, r: 0xc4200ea0f0
langserver: wsConn: 0xc420077440 - NextReader - reader: 0xc420061a40, messageType: 1
langserver: wsConn: 0xc420077440 - NextWriter - writer: 0xc420061a50
--> request #0: initialize: {"rootPath":"/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver","capabilities":{"dynamicRegistration":true,"workspace":{"applyEdit":true},"textDocument":{"willSaveNotification":true,"willSaveWaitUntilRequest":true}},"initializationOptions":{"rootImportPath":"github.com/sourcegraph/go-langserver/langserver","GOPATH":"/Users/mbana/go","GOROOT":"/usr/local/opt/go/libexec"},"trace":"messages"}
langserver-go: Handle - req: &{Method:initialize Params:0xc4200e9200 ID:0 Meta:<nil> Notif:false}
langserver-go: Handle InitTracer - req: &{Method:initialize Params:0xc4200e9200 ID:0 Meta:<nil> Notif:false}, err: <nil>
langserver-go: Handle InitializeResult - req: &{Method:initialize Params:0xc4200e9200 ID:0 Meta:<nil> Notif:false}, req.Params: &[123 34 114 111 111 116 80 97 116 104 34 58 34 47 85 115 101 114 115 47 109 98 97 110 97 47 103 111 47 115 114 99 47 103 105 116 104 117 98 46 99 111 109 47 115 111 117 114 99 101 103 114 97 112 104 47 103 111 45 108 97 110 103 115 101 114 118 101 114 47 108 97 110 103 115 101 114 118 101 114 34 44 34 99 97 112 97 98 105 108 105 116 105 101 115 34 58 123 34 100 121 110 97 109 105 99 82 101 103 105 115 116 114 97 116 105 111 110 34 58 116 114 117 101 44 34 119 111 114 107 115 112 97 99 101 34 58 123 34 97 112 112 108 121 69 100 105 116 34 58 116 114 117 101 125 44 34 116 101 120 116 68 111 99 117 109 101 110 116 34 58 123 34 119 105 108 108 83 97 118 101 78 111 116 105 102 105 99 97 116 105 111 110 34 58 116 114 117 101 44 34 119 105 108 108 83 97 118 101 87 97 105 116 85 110 116 105 108 82 101 113 117 101 115 116 34 58 116 114 117 101 125 125 44 34 105 110 105 116 105 97 108 105 122 97 116 105 111 110 79 112 116 105 111 110 115 34 58 123 34 114 111 111 116 73 109 112 111 114 116 80 97 116 104 34 58 34 103 105 116 104 117 98 46 99 111 109 47 115 111 117 114 99 101 103 114 97 112 104 47 103 111 45 108 97 110 103 115 101 114 118 101 114 47 108 97 110 103 115 101 114 118 101 114 34 44 34 71 79 80 65 84 72 34 58 34 47 85 115 101 114 115 47 109 98 97 110 97 47 103 111 34 44 34 71 79 82 79 79 84 34 58 34 47 117 115 114 47 108 111 99 97 108 47 111 112 116 47 103 111 47 108 105 98 101 120 101 99 34 125 44 34 116 114 97 99 101 34 58 34 109 101 115 115 97 103 101 115 34 125]
<-- result #0: initialize: {"capabilities":{"textDocumentSync":1,"hoverProvider":true,"definitionProvider":true,"referencesProvider":true,"documentSymbolProvider":true,"workspaceSymbolProvider":true}}

```

### `GOPATH` etc.

Adjust:

* `WORKSPACE_ROOT_PATH` in [./demo/monaco.go.js](https://github.com/mbana/monaco-go/blob/master/demo/monaco-go.js#L22).
* `ROOT_PATH` in [./src/fillers/vscode/monaco-workspace.ts#L54](https://github.com/mbana/monaco-go/blob/master/src/fillers/vscode/monaco-workspace.ts#L54).

Currently I've hardcoded the paths to so that it works in the container, it
might fail if you try to run it on the host machine directly.

## References

* [`monaco-editor`](https://github.com/Microsoft/monaco-editor).
* [`vscode-css-languageservice`](https://github.com/Microsoft/vscode-css-languageservice).
* [`monaco.d.ts`](https://github.com/Microsoft/monaco-css/blob/master/src/monaco.d.ts).
* [Visual Studio Code](https://github.com/Microsoft/vscode).

* `build`: [/build/README.md](/build/README.md).
* `Dockerfile`: [/build/docker/README.md](/build/docker/README.md).

## License

[MIT](https://github.com/Microsoft/monaco-css/blob/master/LICENSE.md)