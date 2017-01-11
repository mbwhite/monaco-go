class MonacoGoNavElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-nav';
	}

	static get config() {
		// properties, observers meta data
		return {
			properties: {
				selectionFile: {
					type: MonacoGoProjectFile,
					notify: true,
				},
				selectionProject: {
					type: MonacoGoProjectRepo,
					notify: true,
				},

				editorModel: {
					type: MonacoGoProjectFile,
					notify: true,
				},
				standaloneCodeEditor: {
					type: Object,
					notify: true,
				},
			},
			observers: [
				'_selectionFile(selectionFile)',
				'_standaloneCodeEditor(standaloneCodeEditor)',
			]
		};
	}

	_standaloneCodeEditor(standaloneCodeEditor) {
		let editor = standaloneCodeEditor;
		if (!editor) {
			return;
		} else {
			editor.onDidChangeModel(this._onDidChangeModel.bind(this));
		}
	}

	_onDidChangeModel(modelChangeEvent) {
		let change = modelChangeEvent;
		console.log('_onDidChangeModel', modelChangeEvent);
		// newModelUrl:
		// "{"scheme":"http","authority":"localhost:8080","path":"/monaco-go/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/modes/websocket.go","fsPath":"/monaco-go/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/modes/websocket.go","query":"","fragment":"","external":"http://localhost:8080/monaco-go/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/modes/websocket.go","$mid":1}"
		//
		// oldModelUrl:
		// "{"scheme":"inmemory","authority":"model","path":"/1","fsPath":"/1","query":"","fragment":"","external":"inmemory://model/1","$mid":1}"
		if (change.newModelUrl) {
			let newModel = change.newModelUrl;

			// "/monaco-go/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/modes/websocket.go"
			let pathname = location.pathname;
			let pathPrefix = pathname.substr(0, pathname.length - 1);

			let pathModel = newModel.path;
			let name = pathModel.replace(pathPrefix, '');

			// "http://localhost:8080/monaco-go/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/modes/websocket.go"
			let download_url = newModel.toString();

			let type = 'file';

			let editorModel = new MonacoGoProjectFile(name, download_url, type);
			this.editorModel = editorModel;
		}
	}

	_selectionFile(selectionFile) {

	}

	_onBack(e) {
		console.log('_onBack', e);
	}

	_onForward(e) {
		console.log('_onForward', e);
	}
}

customElements.define(MonacoGoNavElement.is, MonacoGoNavElement);