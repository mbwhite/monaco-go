class MonacoGoLangserverConfigElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-langserver-config';
	}

	static get config() {
		return {
			properties: {
				selectionProject: {
					type: MonacoGoProjectRepo,
				},
				langserverConfig: {
					type: MonacoGoLangserverConfig,
					notify: true,
				},
				isWorking: {
					type: Boolean,
					notify: true,
					value: () => {
						return false;
					},
				},
				langserverStatus: {
					// type: MonacoGoLangserverStatus
					type: Object,
					notify: true,
					value: () => {
						return {
							err: null,
							ok: null,
						};
					},
				}
			},
			observers: [
				'_selectionProject(selectionProject.repo.url, selectionProject)',
			],
		};
	}

	_selectionProject(projectUrl, selectionProject) {
		let rootPath = null;
		// when url changes get the rootPath
		if (projectUrl && selectionProject) {
			rootPath = selectionProject.getRootPath();
		}

		this.set('langserverConfig.rootPath', rootPath);
	}

	_onRefresh(e) {
		this.isWorking = true;
		this.langserverConfig.spawnServer().then((res) => {
			let ok = JSON.stringify(res);
			let err = null;
			Polymer.Async.run(() => {
				this.isWorking = false;
				this.set('langserverStatus.ok', ok);
				this.set('langserverStatus.err', err);
			}, 3000);
		}).catch((excep) => {
			let ok = null;
			let err = JSON.stringify(excep);
			Polymer.Async.run(() => {
				this.isWorking = false;
				this.set('langserverStatus.ok', ok);
				this.set('langserverStatus.err', err);
			}, 3000);
		});
	}
}

customElements.define(MonacoGoLangserverConfigElement.is, MonacoGoLangserverConfigElement);