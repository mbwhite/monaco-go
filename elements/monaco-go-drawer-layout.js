class MonacoGoOperationInProgress {
	constructor(id = '', params = '', inProgress = false) {
		this.id = id;
		this.params = params;
		this.inProgress = inProgress;
	}
}

class MonacoGoDrawerLayoutElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-drawer-layout';
	}

	static get config() {
		return {
			properties: {
				selectionFile: {
					type: MonacoGoProjectFile,
				},
				selectionProject: {
					type: MonacoGoProjectRepo,
				},
				langserverConfig: {
					type: MonacoGoLangserverConfig,
					notify: true,
					value: () => {
						return new MonacoGoLangserverConfig();
					}
				},

				// https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html#ondidchangemodel
				// so that we can listen to file change events, say, after clicking go to definition
				standaloneCodeEditor: {
					type: Object,
					notify: true,
				},
				// IDiposable[] that monaco-editor returns
				disposables: {
					type: Array,
					notify: true,
					value: () => {
						return [];
					},
				},

				// indicate if an operation is in progress, say, an editor one
				operation: {
					type: MonacoGoOperationInProgress,
					notify: true,
					value: () => {
						return new MonacoGoOperationInProgress();
					},
				},
			}
		};
	}

	ready() {
		super.ready();
		this._initMonaco();
	}

	static _initialFileDetails() {
		let GOPATH = MonacoGoLangserverConfig.GOPATH();

		let packageFromGoPath = 'src/github.com/sourcegraph/go-langserver/langserver';
		let fromRootPath = 'modes/websocket.go';
		let fullPath = `${GOPATH}/${packageFromGoPath}/${fromRootPath}`;

		// location.href = http://localhost:8080/monaco-go/
		let locationHref = location.href;
		let locationNoLeadingSlash = locationHref.substr(0, locationHref.length - 1);
		let fullPathNoSlash = fullPath.substr(1);
		let url = `${locationNoLeadingSlash}/${fullPathNoSlash}`;

		return {
			packageFromGoPath,
			fromRootPath,
			fullPath,
			url,
		};
	}

	static _createModel(goFile, fileDetails) {
		let value = goFile;
		var language = 'go';
		let uri = monaco.Uri.parse(fileDetails.url);

		return monaco.editor.createModel(value, language, uri);
	}

	static _overrideOutputChannel(vscodeFiller) {
		let appendLineBase = vscodeFiller.MonacoOutputChannel.prototype.appendLine;
		vscodeFiller.MonacoOutputChannel.prototype.appendLine = function(value) {
			// make sure it tries to log something...
			if (this._hide) {
				this._hide = false;
			}

			let res = appendLineBase.call(this, value);
			GlobalMonacoOutputChannelStore.push(res);
		};
	}

	_findContainerEl() {
		// this is a hack as this is a really a slotted element
		//
		// <slot id="monaco-editor-container" name="editor-slot"></slot>
		// let container =
		let container = document.getElementById('container');
		return container;
	}

	_initMonaco() {
		let self = this;

		let uiHooks = this._createUIHooks();

		let fileDetails = MonacoGoDrawerLayoutElement._initialFileDetails();
		let containerEl = this._findContainerEl();
		fetch(fileDetails.url).then((fileContents) => {
			return fileContents.text();
		}).then((fileTxt) => {
			require([
				'vs/basic-languages/src/monaco.contribution',
				'vscode',
				'vs/language/go/monaco.contribution',
				'vs/language/go/goMode'
			], function (basic, vscodeFiller, goContribution, goMode) {
				MonacoGoDrawerLayoutElement._overrideOutputChannel(vscodeFiller);

				let goDefaults = goContribution.goDefaults;
				monaco.languages.onLanguage('go', () => {
					let disposables = goMode.setupMode(goDefaults, uiHooks);
					self.disposables = disposables;
				});

				self.standaloneCodeEditor = monaco.editor.create(containerEl);
				window.langserverEditor = self.standaloneCodeEditor;
				// self.notifyPath('standaloneCodeEditor');

				let model = MonacoGoDrawerLayoutElement._createModel(fileTxt, fileDetails);
				window.langserverEditor.setModel(model);
			});
		});
	}
	_createUIHooks()  {
		return {
			onRequestStart: (details) => {
				this.operation.id = '';
				this.operation.details = '';

				if (details && details.msg) {
					let msg = details.msg;

					if (Number.isInteger(msg.id)) {
						this.operation.id = msg.id;
					}

					if (msg.result) {
						this.operation.params = JSON.stringify(msg.result);
					} else if (msg.method) {
						this.operation.params = JSON.stringify(msg.method);
					} else {
						this.operation.params = JSON.stringify(msg);
					}
				}

				if (details && details.msg && Number.isInteger(details.msg.id)) {
					this.operation.inProgress = true;
				}

				this.notifyPath('operation');
			},
			onRequestEnd: (details) => {
				this.operation.id = '';
				this.operation.details = '';

				if (details && details.msg) {
					let msg = details.msg;

					if (Number.isInteger(msg.id)) {
						this.operation.id = msg.id;
					}

					if (msg.result) {
						this.operation.params = JSON.stringify(msg.result);
					} else if (msg.method) {
						this.operation.params = JSON.stringify(msg.method);
					} else {
						this.operation.params = JSON.stringify(msg);
					}
				}

				if (details && details.msg && Number.isInteger(details.msg.id)) {
					this.operation.inProgress = false;
				}

				this.notifyPath('operation');
			},
			extra: {},
		};
	}

	_findListElement(drawer) {
		let list;

		let drawerContent = drawer.querySelector('.drawer-content');
		if (drawerContent) {
			let logEl = drawerContent.querySelector('monaco-go-langserver-log');
			if (logEl && logEl.shadowRoot) {
				list = logEl.shadowRoot.querySelector('iron-list');
			}
		}

		return list;
	}

	// event handlers
	_onToggleDrawer(e) {
		let drawer = this.$.drawer;
		if (drawer) {
			drawer.toggle();
		}

		// if (!drawer.opened) {
		// 	return;
		// }

		// let list = this._findListElement(drawer);
		// if (!list) {
		// 	console.info('_onToggleDrawer - could not find an iron-list in: ', drawer);
		// 	return;
		// }

		// list.fire('iron-resize');
	}

	_onToggleDrawerEnd(e) {
		let drawer = this.$.drawerEnd;
		if (drawer) {
			drawer.toggle();

		}
	}

	_onSearch(e) {

	}
}

customElements.define(MonacoGoDrawerLayoutElement.is, MonacoGoDrawerLayoutElement);