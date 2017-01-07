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
	}
}

class MonacoGoProjectFile {
	constructor(name, download_url) {
		this.name = name;
		this.url = download_url;
		this.download_url = download_url;
	}
}

// todo: use MonacoGoProjectFiles
class MonacoGoProjectFiles {
	constructor() {
	}

	static parse(contents = []) {
		let files = contents.map((content) => {
			let name = content.name;
			let download_url = content.download_url;

			let file = new MonacoGoProjectFile(name, download_url);
			return file;
		});
		return files;
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

	static _fetch(repo) {
		let getEndPoint = (owner, repo, path) => {
			// let res = `/repos/:owner/:repo/contents/:path`;
			// let endpoint = `repos/${owner}/${repo}/contents/:path`;
			let endpoint = `repos/${owner}/${repo}/contents`;
			return endpoint;
		};

		let endpoint = getEndPoint(repo.owner, repo.name);
		let url = `https://api.github.com/${endpoint}`;
		let url_backup = `${endpoint}.json`;

		//url = url_backup;

		return fetch(url).then((response) => {
			// log error then try locally cached version of the repo's contents
			if (response.status !== 200) {
				let err = new Error(response);
				console.log(err);

				return fetch(url_backup).then((contents) => {
					return contents.json();
				})
			}

			return response.json();
		}).then((contents) => {
			let files = MonacoGoProjectFiles.parse(contents);

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