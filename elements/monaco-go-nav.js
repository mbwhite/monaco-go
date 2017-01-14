/**
 * stores monaco.Uri in the back and forward lists.
 */
class MonacoGoFilesHistory {
	constructor() {
		this.back = [];
		this.forward = [];
	}
}

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
				filesHistory: {
					type: MonacoGoFilesHistory,
					notify: true,
					value: () => {
						return new MonacoGoFilesHistory();
					},
				},
				isForwardEnabled: {
					type: Boolean,
					notify: true,
					value: () => {
						return false;
					},
				},
				isBackEnabled: {
					type: Boolean,
					notify: true,
					value: () => {
						return false;
					},
				},

				editorModel: {
					type: MonacoGoProjectFile,
					notify: true,
				},
				standaloneCodeEditor: {
					type: Object,
					notify: true,
				},
				tryLoadModel: {
					type: Function,
					notify: true,
				}
			},
			observers: [
				'_standaloneCodeEditor(standaloneCodeEditor, tryLoadModel)',
				'_isBackEnabled(filesHistory.back.length)',
				'_isForwardEnabled(filesHistory.forward.length)',
			]
		};
	}

	ready() {
		super.ready();
		require(['vscode'], (vscodeFiller) => {
			let tryLoadModel = vscodeFiller.MonacoLanguages.tryLoadModel;
			this.tryLoadModel = tryLoadModel.bind(vscodeFiller.MonacoLanguages);
		});
	}

	_isBackEnabled(length) {
		this.isBackEnabled = length > 0;
	}

	_isForwardEnabled(length) {
		this.isForwardEnabled = length > 0;
	}

	_standaloneCodeEditor(standaloneCodeEditor, tryLoadModel) {
		let editor = standaloneCodeEditor;
		if (!editor || !tryLoadModel) {
			return;
		} else {
			editor.onDidChangeModel(this._onDidChangeModel.bind(this));
		}
	}

	_editorModel(newModelUrl, oldModelUrl) {
		// // if a new model arrives, enable the back button
		// // and push the new file
		// this.filesHistory.back.push(newModelUrl);
		// this.notifyPath('filesHistory');
	}

	_onDidChangeModel(modelChangeEvent) {
		let { newModelUrl, oldModelUrl } = modelChangeEvent;
		// let { newModelUrl, oldModelUrl: null } = modelChangeEvent;

		// newModelUrl:
		// {
		// 	"scheme": "http",
		// 	"authority": "localhost:8080",
		// 	"path": "/monaco-go/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/modes/websocket.go",
		// 	"fsPath": "/monaco-go/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/modes/websocket.go",
		// 	"query": "",
		// 	"fragment": "",
		// 	"external": "http://localhost:8080/monaco-go/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/modes/websocket.go",
		// 	"$mid": 1
		// }
		if (newModelUrl) {
			// "/monaco-go/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/modes/websocket.go"
			let currentPath = location.pathname;
			let pathPrefix = currentPath.substr(0, currentPath.length - 1);
			let pathModel = newModelUrl.path;

			let name = pathModel.replace(pathPrefix, '');
			// "http://localhost:8080/monaco-go/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/modes/websocket.go"
			let download_url = newModelUrl.toString();
			let type = 'file';

			let editorModel = new MonacoGoProjectFile(name, download_url, type);
			this.editorModel = editorModel;
		}

		if (oldModelUrl) {

		}

		// oldModelUrl:
		// {
		// 	"scheme": "inmemory",
		// 	"authority": "model",
		// 	"path": "/1",
		// 	"fsPath": "/1",
		// 	"query": "",
		// 	"fragment": "",
		// 	"external": "inmemory://model/1",
		// 	"$mid": 1
		// }
		if (oldModelUrl.fsPath.includes('.go') && newModelUrl) {
			// if a new model arrives, enable the back button
			// and push the new file
			let back = this.filesHistory.back;
			let forward = this.filesHistory.forward;

			// don't push the same thing on twice
			let lastBack = this._lastItem(back);
			if (lastBack && (lastBack.toString() === newModelUrl.toString())) {
				return;
			}
			let lastForward = this._lastItem(forward);
			if (lastForward && (lastForward.toString() === newModelUrl.toString())) {
				return;
			}

			back.push(oldModelUrl);
			this.notifyPath('filesHistory');
		}
	}

	_lastItem(arr) {
		let last;
		if (arr && arr.length) {
			last = arr[arr.length - 1];
		}
		return last;
	}

	_onBack(e) {
		if (!this.tryLoadModel) {
			return;
		}
		if (!this.isBackEnabled) {
			return;
		}

		let filesHistory = this.filesHistory;
		let back = filesHistory.back;
		let forward = filesHistory.forward;
		let uri = this._lastItem(back);

		this.tryLoadModel(uri).then((model) => {
			let currentModel = this.standaloneCodeEditor.getModel();
			let currentUri = currentModel.uri;

			this.standaloneCodeEditor.setModel(model);

			back.pop();
			forward.push(currentUri);
			this.notifyPath('filesHistory');
		}).catch((excep) => {
			throw excep;
		});
	}

	_onForward(e) {
		if (!this.tryLoadModel) {
			return;
		}
		if (!this.isForwardEnabled) {
			return;
		}

		let filesHistory = this.filesHistory;
		let back = filesHistory.back;
		let forward = filesHistory.forward;
		let uri = forward[forward.length - 1];

		this.tryLoadModel(uri).then((loadedModel) => {
			let currentModel = this.standaloneCodeEditor.getModel();
			let currentUri = currentModel.uri;

			this.standaloneCodeEditor.setModel(loadedModel);

			forward.pop();
			back.push(currentUri);
			this.notifyPath('filesHistory');
		}).catch((excep) => {
			throw excep;
		});
	}
}

customElements.define(MonacoGoNavElement.is, MonacoGoNavElement);