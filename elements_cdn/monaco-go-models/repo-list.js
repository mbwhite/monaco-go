class MonacoGoRepoListItem {
	constructor(name, url, owner) {
		this.owner = owner;
		this.name = name;
		this.url = url;

		// let ironListModel = {
		// 	// index in the item array
		// 	index: 0,
		// 	// true if the current item is selected
		// 	selected: false,
		// 	// a dynamically generated tabIndex for focus management
		// 	tabIndex: -1,
		// 	// user data corresponding to items[index]
		// 	item: Object.assign({}, this),
		// };

		// Object.assign(this, ironListModel);
	}
}

class MonacoGoRepoList extends Array {
	constructor(items) {
		super(...items);
	}

	static create() {
		let urls = [
			'https://github.com/sourcegraph/go-langserver.git',
			'https://github.com/sourcegraph/jsonrpc2.git',
			'https://github.com/sourcegraph/ctxvfs.git',
		];

		// parse the urls
		let repos = urls.map((repoUrl, index) => {
			// 'https://github.com/sourcegraph/go-langserver.git'
			let repoNameIndex = repoUrl.lastIndexOf('/');
			let orgName = repoUrl.substr(0, repoNameIndex);
			let orgNameIndex = orgName.lastIndexOf('/');

			let repoNameFull = repoUrl.substr(repoNameIndex + 1);
			let repoNameExtension = repoNameFull.lastIndexOf('.');

			let name = repoNameFull.substr(0, repoNameExtension);
			let org = orgName.substr(orgNameIndex + 1);

			let repoItem = new MonacoGoRepoListItem(name, repoUrl, org);
			// repoItem.index = index;
			repoItem.selected = (index === 0);
			return repoItem;
		});

		return new MonacoGoRepoList(repos);
	}
}