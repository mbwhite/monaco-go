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
		if (!file) {
			return false;
		}

		let canSelect = false;
		if (file.type === 'file' && file.name) {
			canSelect = this._isGoFile(file.name);
		}
		return canSelect;
	}

	_isDir(fileType) {
		if (!fileType) {
			return false;
		}

		if (fileType === 'dir') {
			return true;
		}
	}

	_isGoFile(fileName) {
		let indexExtension = fileName.lastIndexOf('.');

		let ext = fileName.substr(indexExtension);

		let isGoFile = ext === '.go';
		return isGoFile;
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