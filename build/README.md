# build

todo.

## build output

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
...
[Thu, 15 Dec 2016 01:38:38 GMT] "GET /demo/monaco-go.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
...
langserver-go: wsConn upgrading - w: 0xc4200619f0, r: 0xc4200ea0f0
langserver: wsConn: 0xc420077440 - upgraded - w: 0xc4200619f0, r: 0xc4200ea0f0
langserver: wsConn: 0xc420077440 - NextReader - reader: 0xc420061a40, messageType: 1
langserver: wsConn: 0xc420077440 - NextWriter - writer: 0xc420061a50
--> request #0: initialize: {"rootPath":"/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver","capabilities":{"dynamicRegistration":true,"workspace":{"applyEdit":true},"textDocument":{"willSaveNotification":true,"willSaveWaitUntilRequest":true}},"initializationOptions":{"rootImportPath":"github.com/sourcegraph/go-langserver/langserver","GOPATH":"/Users/mbana/go","GOROOT":"/usr/local/opt/go/libexec"},"trace":"messages"}
...
<-- result #0: initialize: {"capabilities":{"textDocumentSync":1,"hoverProvider":true,"definitionProvider":true,"referencesProvider":true,"documentSymbolProvider":true,"workspaceSymbolProvider":true}}
```

## test

[../test/README.md](../test/README.md).
