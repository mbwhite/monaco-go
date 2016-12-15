class MonacoGo {
	static getExampleUrl() {
		const BRANCH_PREFIX = 'https://raw.githubusercontent.com/mbana/go-langserver/websocket-gorilla';
		// const BRANCH_PREFIX = 'https://raw.githubusercontent.com/mbana/go-langserver/master';
		// const filePath = '/langserver/cmd/langserver-antha/langserver-go.go';
		const filePrefix = '/langserver';
		const filePath = '/handler.go';
		let exampleUrl = [
			BRANCH_PREFIX,
			filePrefix,
			filePath
		].join('');

		return {
			exampleUrl,
			filePath
		};
	}

	static toUri(filePath) {
		const SCHEME = 'file://';
		const WORKSPACE_ROOT_PATH = '/go/src/github.com/sourcegraph/go-langserver/langserver';

		return [
			SCHEME,
			WORKSPACE_ROOT_PATH,
			filePath
		].join('');
	}

	static createModel(exampleGo, filePath) {
		// possible uri values:
		//
		// ./.dev-tmp/langserver-antha_client_valid.log
		// ./langserver/cmd/langserver-antha/langserver-antha
		// ./langserver/cmd/langserver-antha/langserver-go.go
		// ./langserver/cmd/langserver-go/langserver-go.go
		// ./langserver/langserver_test.go

		let value = exampleGo;
		var language = 'go';
		let uri = MonacoGo.toUri(filePath);

		return monaco.editor.createModel(value, language, uri);
	}
}

let {
	exampleUrl,
	filePath
} = MonacoGo.getExampleUrl();

let examplePromise = fetch(exampleUrl).then(function (exampleGo) { return exampleGo.text(); });
examplePromise.then(function (exampleGo) {
	require([
		'vs/basic-languages/src/monaco.contribution',
		'vs/language/go/monaco.contribution'
	], function () {
		let model = MonacoGo.createModel(exampleGo, filePath);
		let editorOpts = {
			model
		};

		let editor = monaco.editor.create(
			document.getElementById('container'),
			editorOpts
		);
	});
});