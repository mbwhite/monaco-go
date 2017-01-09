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
		'vs/language/go/monaco.contribution',
		'vscode'
	], function (basic, go, vscodeFiller) {
		let appendLineBase = vscodeFiller.MonacoOutputChannel.prototype.appendLine;
		vscodeFiller.MonacoOutputChannel.prototype.appendLine = function(value) {
			// make sure it tries to log something...
			if (this._hide) {
				this._hide = false;
			}

			let res = appendLineBase.call(this, value);
			// console.log('res: ', res);
			GlobalMonacoOutputChannelStore.push(res);
		};

		let model = MonacoGo.createModel(exampleGo, filePath);
		window.langserverEditor = monaco.editor.create(
			document.getElementById('container')
		);
		window.langserverEditor.setModel(model);

		let fileSelectedEl = document.getElementById('file-selected-name');
		console.log('fileSelectedEl: ', fileSelectedEl);
		// elFileUri.innerHTML = filePath;
	});
});