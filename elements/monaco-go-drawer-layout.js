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
				operationUiHooks: {
					type: MonacoGoOperationUiHooks,
					notify: true,
				},
			},
			observers: [
				'_operationUiHooks(operationUiHooks)'
			]
		};
	}

	ready() {
		super.ready();
	}

	_operationUiHooks(operationUiHooks) {
		if (!operationUiHooks) {
			return;
		}

		this._initMonaco(operationUiHooks);
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

	_initMonaco(uiHooks) {
		let self = this;

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
	}

	_onToggleDrawerEnd(e) {
		let drawer = this.$.drawerEnd;
		if (drawer) {
			drawer.toggle();

		}
	}
}

customElements.define(MonacoGoDrawerLayoutElement.is, MonacoGoDrawerLayoutElement);