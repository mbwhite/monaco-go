class MonacoGoRepoFilesElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-repo-files';
	}

	static get config() {
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

	_canSelect(file) {
		let canSelect = false;
		if (file && file.name) {
			let name = file.name;
			let indexExtension = name.lastIndexOf('.');

			let ext = name.substr(indexExtension);
			let isGoFile = ext === '.go';

			canSelect = isGoFile;
		}
		return canSelect;
	}

	_hideList(selectionProject) {
		let hide = false;
		if (!selectionProject || !selectionProject.files || selectionProject.files.length <= 0) {
			hide = true;
		}
		return hide;
	}
}

customElements.define(MonacoGoRepoFilesElement.is, MonacoGoRepoFilesElement);