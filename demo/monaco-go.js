const GOPATH = '/Users/mbana/go';

class MonacoGoRepoUtils {
	static toGitHubUrl(filePath) {
		// https://raw.githubusercontent.com/sourcegraph/go-langserver/master/langserver/handler.go
		// return filePath;

		let fileUrl = `https://raw.githubusercontent.com/mbana/go-langserver/websocket-gorilla/langserver/modes/websocket.go`
		return fileUrl;
	}
}

class MonacoGo {
	static getExampleUrl() {
		let packagePrefix = 'src/github.com/sourcegraph/go-langserver/langserver';
		let fileName = 'modes/websocket.go';
		let filePath = `${GOPATH}/${packagePrefix}/${fileName}`;

		return filePath;
	}

	static createModel(exampleGo, filePath) {
		let value = exampleGo;
		var language = 'go';

		let fileUriPrefix = 'http://';
		let fileUri = `${fileUriPrefix}${filePath}`;
		let uri = monaco.Uri.parse(fileUri);

		return monaco.editor.createModel(value, language, uri);
	}
}

let filePath = MonacoGo.getExampleUrl();
let fileUrl = MonacoGoRepoUtils.toGitHubUrl(filePath);
let examplePromise = fetch(fileUrl).then((exampleGo) => {
	return exampleGo.text();
}).then((exampleGo) => {
	require([
		'vs/basic-languages/src/monaco.contribution',
		'vs/language/go/monaco.contribution'
	], function () {
		let model = MonacoGo.createModel(exampleGo, filePath);

		window.langserverEditor = monaco.editor.create(
			document.getElementById('container')
		);

		window.langserverEditor.setModel(model);

		// let elFileUri = document.getElementById('file_uri');
		// elFileUri.innerHTML = filePath;
	});
});