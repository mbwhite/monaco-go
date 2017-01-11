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
				isWaiting: {
					type: Boolean,
					notify: true,
					value: () => {
						return false;
					},
				}
			},
			observers: [
				'_reposList(reposList)',
				'_isWaiting(selectionRepo, selectionProject)',
			]
		};
	}

	_reposList(reposList) {
		Polymer.dom.flush();
		Polymer.RenderStatus.afterNextRender(this, () => {
			if (reposList && reposList.length >= 1) {
				let initialSelection = reposList[0];

				// this.selectionRepo = initialSelection;
				// this.notifyPath('selectionRepo');
				this.set('selectionRepo', initialSelection);

				let list = this.$.reposListEl;
				if (list) {
					list.selectItem(initialSelection);
				}
			}
		});
	}

	_selectionRepo(selectionNew, selectionOld) {
		if (selectionNew === selectionOld) {
			// do nothing
			return;
		}

		this.selectionProject = null;
		if (!selectionNew) {
			return;
		}

		let repo = selectionNew;
		MonacoGoProjectRepo.create(repo).then((project) => {
			this.set('selectionProject', project);
		}).catch((excep) => {
			throw excep;
		});
	}

	_isWaiting(selectionRepo, selectionProject) {
		let isWaiting = false;

		if ((selectionRepo && !selectionProject) ||
			(selectionRepo && selectionProject && !selectionProject.files) ||
			(selectionRepo && selectionProject && !selectionProject.files.length)) {
				isWaiting = true;
		}

		this.isWaiting = isWaiting;
		// this.notifyPath('isWaiting');
	}

	_computeCardContent(isWaiting) {
		return isWaiting ? 'loading' : '';
	}
}

// Register custom element definition using standard platform API
customElements.define(MonacoGoReposElement.is, MonacoGoReposElement);