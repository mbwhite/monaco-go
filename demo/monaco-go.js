class MonacoGo {
	// i've created a symlink to $GOPATH in the root of the webserver
	static getExampleUrl() {
		const dirPrefix = '/go/src/github.com/sourcegraph/go-langserver';
		const filePrefix = '/langserver';
		const fileName = '/handler.go';
		let exampleUrl = [
			dirPrefix,
			filePrefix,
			fileName
		].join('');

		return {
			exampleUrl,
			fileName
		};
	}

	static toUri(fileName) {
        const SCHEME_PREFIX_HTTP = 'http://localhost:8080';
		const WORKSPACE_ROOT_PATH = '/go/src/github.com/sourcegraph/go-langserver/langserver';

		return [
			SCHEME_PREFIX_HTTP,
			WORKSPACE_ROOT_PATH,
			fileName
		].join('');
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
		let editorOpts = {
			model
		};

		let editor = monaco.editor.create(
			document.getElementById('container'),
			editorOpts
		);
	});
});