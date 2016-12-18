let TestMessages = {
	ONE: ``,
	MANY: [`Content-Length: 765
Content-Type: application/vscode-jsonrpc; charset=utf8

{"method":"textDocument/publishDiagnostics","params":{"uri":"file:///Users/mbana/go/src/github.com/sourcegraph/go-langserver/langservermodes/websocket.go","diagnostics":[{"range":{"start":{"line":51,"character":7},"end":{"line":51,"character":11}},"severity":1,"source":"go","message":"undeclared name: conn"},{"range":{"start":{"line":53,"character":1},"end":{"line":53,"character":7}},"severity":1,"source":"go","message":"undeclared name: asdasd"},{"range":{"start":{"line":53,"character":1},"end":{"line":53,"character":7}},"severity":1,"source":"go","message":"asdasd (invalid operand) is not used"},{"range":{"start":{"line":51,"character":1},"end":{"line":51,"character":3}},"severity":1,"source":"go","message":"bb declared but not used"}]},"jsonrpc":"2.0"}Content-Length: 268
Content-Type: application/vscode-jsonrpc; charset=utf8

{"id":4,"result":{"contents":[{"language":"go","value":"func NewHandler() Handler"},{"language":"markdown","value":"NewHandler creates a Go language server handler. \n\n"}],"range":{"start":{"line":56,"character":23},"end":{"line":56,"character":33}}},"jsonrpc":"2.0"}`]
};

export { TestMessages };