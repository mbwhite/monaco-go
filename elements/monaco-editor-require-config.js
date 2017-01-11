// Loading basic-languages to get the css language definition
var require = {
	baseUrl: '/monaco-go/',
	paths: {
		'lodash': 'node_modules/lodash/lodash',
		'vscode': 'out/fillers/vscode',

		'vscode-languageserver-types': 'node_modules/vscode-languageserver-types/lib/main',
		'vscode-jsonrpc': 'node_modules/vscode-languageclient/node_modules/vscode-jsonrpc/lib/main',
		'vscode-languageclient': 'node_modules/vscode-languageclient/lib/main',

		'vs/basic-languages': 'node_modules/monaco-languages/release',
		'vs/language/go': 'release/dev',
		'vs': 'node_modules/monaco-editor-core/dev/vs'
	}
};