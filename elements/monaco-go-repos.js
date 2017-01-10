class MonacoGoReposElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-repos';
	}

	static get config() {
		return {
			properties: {
				reposList: {
					type: MonacoGoRepoList,
					notify: true,
					value: () => {
						return MonacoGoRepoList.create();
					},
				},
				selectionRepo: {
					type: MonacoGoRepoListItem,
					notify: true,
					observer: '_selectionRepo'
				},

				selectionProject: {
					type: MonacoGoProjectRepo,
					notify: true,
				},

				// indicates if we're done fetching the contents of the repo
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