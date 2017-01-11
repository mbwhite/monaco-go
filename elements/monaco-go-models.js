let _MonacoRepoCache = {};
class MonacoRepoCache {
	static getRepo(repo) {
		let key = `${repo.owner}/${repo.name}`;
		if (_MonacoRepoCache[key]) {
			return _MonacoRepoCache[key];
		}
	}

	static storeRepo(repo, files) {
		let key = `${repo.owner}/${repo.name}`;
		_MonacoRepoCache[key] = files;
	}
}

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
			// repoItem.selected = (index === 0);
			return repoItem;
		});

		return new MonacoGoRepoList(repos);
	}
}

class MonacoGoProjectFile {
	constructor(name, download_url, type = 'file') {
		this.name = name;
		this.url = download_url;
		this.download_url = download_url;
		this.type = type;
	}
}

// todo: use MonacoGoProjectFiles
class MonacoGoProjectFiles {
	constructor() {
	}

	static fetchDir(content, files, repo) {
		if (content.type !== 'dir') {
			return Promise.resolve();
		}


		let path = content.path;
		let fetchUrl = MonacoGoProjectRepo.getEndPoint(repo, path);
		return fetch(fetchUrl).then((response) => {
			// log error then try locally cached version of the repo's contents
			if (response.status !== 200) {
				let err = new Error(response);
				throw err;
			}

			return response.json();
		}).then((contents) => {
			return MonacoGoProjectFiles.parse(contents, files, repo);
		});
	}

	static parse(contents = [], files, repo) {
		let parsedContents = contents.map((content) => {
			let name = content.name;
			let download_url = content.download_url;

			let file;
			if (content.type === 'dir') {
				file = new MonacoGoProjectFile(name, download_url, 'dir');
			} else if (content.type === 'file') {
				 file = new MonacoGoProjectFile(name, download_url);
			}

			if (file) {
				files.push(file);
			}

			return MonacoGoProjectFiles.fetchDir(content, files, repo);

			// content
			// {
			//       "name": "langserver",
			//       "path": "langserver",
			//       "sha": "8c896013543a6f5e3aa1648cb7ab81b95e2d1e73",
			//       "size": 0,
			//       "url": "https://api.github.com/repos/sourcegraph/go-langserver/contents/langserver?ref=master",
			//       "html_url": "https://github.com/sourcegraph/go-langserver/tree/master/langserver",
			//       "git_url": "https://api.github.com/repos/sourcegraph/go-langserver/git/trees/8c896013543a6f5e3aa1648cb7ab81b95e2d1e73",
			//       "download_url": null,
			//       "type": "dir",
			//       "_links": {
			//         "self": "https://api.github.com/repos/sourcegraph/go-langserver/contents/langserver?ref=master",
			//         "git": "https://api.github.com/repos/sourcegraph/go-langserver/git/trees/8c896013543a6f5e3aa1648cb7ab81b95e2d1e73",
			//         "html": "https://github.com/sourcegraph/go-langserver/tree/master/langserver"
			//       }
			//     },
		});

		return Promise.all(parsedContents).then((parsed) => {
			return { parsed, files };
		});
	}
}

class MonacoGoProjectRepo {
	// repo: MonacoGoRepoListItem
	constructor(repo, files) {
		this.repo = repo;
		this.files = files;
	}

	static create(repo) {
		return MonacoGoProjectRepo._fetch(repo).then((files) => {
			return new MonacoGoProjectRepo(repo, files);
		});
	}

	static getEndPoint(repoDetails, path) {
		let _getEndPoint = (owner, repo) => {
			// let res = `/repos/:owner/:repo/contents/:path`;
			// let endpoint = `repos/${owner}/${repo}/contents/:path`;
			let endpoint = `repos/${owner}/${repo}/contents/`;
			return endpoint;
		};

		let endpoint = _getEndPoint(repoDetails.owner, repoDetails.name);
		let url = `https://api.github.com/${endpoint}`;

		let res;
		if (path) {
			res = `${url}${path}?access_token=55dfea5f366824784bbf3103a22d3070dc13a445`
		} else {
			res = `${url}?access_token=55dfea5f366824784bbf3103a22d3070dc13a445`
		}
		return res;
	}

	static _fetch(repo) {
		let fetchUrl = MonacoGoProjectRepo.getEndPoint(repo);
		return fetch(fetchUrl).then((response) => {
			// log error then try locally cached version of the repo's contents
			if (response.status !== 200) {
				let err = new Error(response);
				throw err;
				// return fetch(url_backup).then((contents) => {
				// 	return contents.json();
				// });
			}

			return response.json();
		}).then((contents) => {
			let files = [];
			return MonacoGoProjectFiles.parse(contents, files, repo);
		}).then((res) => {
			let files = res.files;
			if (!MonacoRepoCache.getRepo(repo)) {
				MonacoRepoCache.storeRepo(repo, files);
			}

			return files;
		}).catch((excep) => {
			// console.error(excep);
			throw new Error(excep);
			return excep;
		});
	}

	getRootPath() {
		// url = https://github.com/sourcegraph/go-langserver.git
		let url = this.repo.url;

		// remove https:// and .git
		let split = url.split(/http\:\/\/|https\:\/\/|\.git/);
		if (split && split.length === 3) {
			// middle entry is the rootPath
			// [,github.com/sourcegraph/jsonrpc2,]
			let rootPath = split[1];
			return rootPath;
		} else {
			let message = `url: ${url}, split: ${split}`;
			throw new Error(message);
		}
	}
}

class MonacoGoLangserverConfig {
	static GOPATH() {
		return '/Users/mbana/go';
	}

	constructor(host = 'localhost', port = ':4389', rootPath) {
		this.host = host;
		this.port = port;
		this.rootPath = rootPath;
	}

	spawnServer() {
		let validation = this.validate();
		if (!validation.length) {
			let res = {
				msg: `ok`
			};
			return Promise.resolve(res);
		} else {
			return Promise.reject(validation);
		}
	}

	validate() {
		let errs = ['host', 'port', 'rootPath'].map((prop) => {
			let err;
			if (!this[prop]) {
				err = `!this[prop]`;
			} else if (!(this[prop].length)) {
				err = `!(this[prop].length)`;
			} else {
				// return undefined
			}

			if (err) {
				return { err, prop };
			}
		});

		let validation = errs.filter((err) => err !== undefined);
		return validation;
	}
}