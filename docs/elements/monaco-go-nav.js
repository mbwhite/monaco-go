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
			}
		};
	}

	_onBack(e) {
		console.log('_onBack', e);
	}

	_onForward(e) {
		console.log('_onForward', e);
	}
}

customElements.define(MonacoGoNavElement.is, MonacoGoNavElement);