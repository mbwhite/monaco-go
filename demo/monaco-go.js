const GOPATH = '';
const ROOT_PATH = '/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver';
const ROOT_IMPORT_PATH = 'src/github.com/sourcegraph/go-langserver/langserver/';

class MonacoGo {
	// i've created a symlink to $GOPATH in the root of the webserver
	static getExampleUrl() {
		const dirPrefix = '/go/';
		const packagePrefix = 'src/github.com/sourcegraph/go-langserver/langserver/';
		const fileName = 'modes/websocket.go'
		let exampleUrl = [
			dirPrefix,
			packagePrefix,
			fileName
		].join('');

		return {
			exampleUrl,
			fileName
		};
	}

	static toUri(fileName) {
		// const SCHEME_PREFIX_HTTP = 'http://localhost:8080';
		// const WORKSPACE_ROOT_PATH = 'src/github.com/sourcegraph/go-langserver/langserver';

		const SCHEME_PREFIX = 'http:///Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver';
		let fullPath = [
			SCHEME_PREFIX,
			// WORKSPACE_ROOT_PATH,
			fileName
		].join('');

		return monaco.Uri.parse(fullPath);
	}

	static createModel(exampleGo, fileName) {
		let value = exampleGo;
		var language = 'go';
		let uri = MonacoGo.toUri(fileName);

		return monaco.editor.createModel(value, language, uri);
	}
}

let {
	exampleUrl,
	fileName
} = MonacoGo.getExampleUrl();

let examplePromise = fetch(exampleUrl).then(function (exampleGo) { return exampleGo.text(); });
examplePromise.then(function (exampleGo) {
	require([
		'vs/basic-languages/src/monaco.contribution',
		'vs/language/go/monaco.contribution'
	], function () {
		let model = MonacoGo.createModel(exampleGo, fileName);

		window.langserverEditor = monaco.editor.create(
			document.getElementById('container')
		);

		window.langserverEditor.setModel(model);
	});
});