// store current paths
let baseUrl = location.href;
// let baseUrl = `${currentPath}/monaco-go/`;


// <script src="https://cdn.jsdelivr.net/lodash/4.17.2/lodash.min.js" integrity="sha256-IyWBFJYclFY8Pn32bwWdSHmV4B9M5mby5bhPHEmeY8w=" crossorigin="anonymous"></script>
// <script src="https://cdn.jsdelivr.net/lodash/4.17.2/lodash.js" integrity="sha256-jCRPoAgIIooCTnLmaSyKMPrFgFh6/T0e8c3i+KkZZ6U=" crossorigin="anonymous"></script>

// Loading basic-languages to get the css language definition
var require = {
	baseUrl,
	paths: {
		'lodash': 'https://cdn.jsdelivr.net/lodash/4.17.2/lodash.min.js',
		'vscode': 'out/fillers/vscode',

		'vscode-languageserver-types': 'node_modules/vscode-languageserver-types/lib/main',
		'vscode-jsonrpc': 'node_modules/vscode-languageclient/node_modules/vscode-jsonrpc/lib/main',
		'vscode-languageclient': 'node_modules/vscode-languageclient/lib/main',

		'vs/basic-languages': 'https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs/basic-languages',
		'vs/language/go': 'release/dev',
		// 'vs': 'node_modules/monaco-editor-core/dev/vs',
		'vs': 'https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs',
	}
};

// Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
// the default worker url location (used when creating WebWorkers). The problem here is that
// HTML5 does not allow cross-domain web workers, so we need to proxy the instantion of
// a web worker through a same-domain script
window.MonacoEnvironment = {
	getWorkerUrl: function(workerId, label) {
		return 'elements/monaco-editor-worker-loader-proxy.js';
	}
};