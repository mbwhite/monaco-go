class MonacoGoReposElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-repos';
	}

	static get config() {
		return {
			properties: {
				reposList: {
					type: Array,
					notify: true,
					value: () => {
						return []
					},
				},
				selectionRepo: {
					type: MonacoGoRepoListItem,
					notify: true,
					observer: '_selectionRepo'
				},
				selectionFile: {
					type: MonacoGoProjectFile,
					notify: true,
				},
				selectionProject: {
					type: MonacoGoProjectRepo,
					notify: true,
				},
				isWorking: {
					type: Boolean,
					notify: true,
					value: () => {
						return false;
					},
				}
			}
		};
	}

	connectedCallback() {
		super.connectedCallback();
		this._createRepos();
	}

	_createRepos() {
		let urls = [
			'https://github.com/sourcegraph/go-langserver.git',
			'https://github.com/sourcegraph/jsonrpc2.git',
			'https://github.com/sourcegraph/ctxvfs.git',
		];

		// parse the urls
		let reposList = urls.map(repoUrl => {
			// 'https://github.com/sourcegraph/go-langserver.git'
			let repoNameIndex = repoUrl.lastIndexOf('/');
			let orgName = repoUrl.substr(0, repoNameIndex);
			let orgNameIndex = orgName.lastIndexOf('/');

			let repoNameFull = repoUrl.substr(repoNameIndex + 1);
			let repoNameExtension = repoNameFull.lastIndexOf('.');

			let name = repoNameFull.substr(0, repoNameExtension);
			let org = orgName.substr(orgNameIndex + 1);
			return new MonacoGoRepoListItem(name, repoUrl, org);
		});

		// push all
		this.push('reposList', ...reposList);
	}

	_selectionRepo(selectionNew, selectionOld) {
		this.isWorking = false;
		this.selectionProject = null;

		if (!selectionNew) {
			return;
		}

		this.isWorking = true;
		let repo = selectionNew;
		MonacoGoProjectRepo.create(repo).then((project) => {
			Polymer.Async.run(() => {
				this.isWorking = false;
				this.set('selectionProject', project);
			}, 500);
		}).catch((excep) => {
			this.isWorking = false;
		});
	}

	_computeCardContent(isWaiting) {
		return isWaiting ? 'loading' : '';
	}
}

// Register custom element definition using standard platform API
customElements.define(MonacoGoReposElement.is, MonacoGoReposElement);