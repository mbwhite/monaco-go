class MonacoGoElement extends Polymer.Element {
	static get is() {
		return 'monaco-go';
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
				}
			}
		};
	}
}

customElements.define(MonacoGoElement.is, MonacoGoElement);