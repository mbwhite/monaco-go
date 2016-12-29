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
			}
		};
	}
}

customElements.define(MonacoGoElement.is, MonacoGoElement);