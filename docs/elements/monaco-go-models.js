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

		url = url_backup;

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
}