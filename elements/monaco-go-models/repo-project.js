class MonacoGoProjectRepo {
	// repo: MonacoGoRepoListItem
	constructor(repo, files) {
		this.repo = repo;
		this.files = files;
	}

	getKey() {
		let repo = this.repo;
		let key = `${repo.owner}/${repo.name}`;
		return key;
	}

	static create(repo) {
		return MonacoGoProjectRepo._fetch(repo).then((files) => {
			return new MonacoGoProjectRepo(repo, files);
		});
	}

	static getToken() {
		let accessToken = localStorage.getItem('monaco.github.access_token');
		if (!accessToken || accessToken.length <= 0) {
			return '';
		}

		// accessToken = `55dfea5f366824784bbf3103a22d3070dc13a445`;
		let token = `?access_token=${accessToken}`;
		return token;
	}

	static getEndPoint(repoDetails, path) {
		let owner = repoDetails.owner;
		let repo = repoDetails.name;
		let apiPath = `repos/${owner}/${repo}/contents/`;
		let url = `https://api.github.com/${apiPath}`;
		let accessToken = MonacoGoProjectRepo.getToken();

		let endpoint = [
			url,
			path,
			accessToken
		].join('');
		return endpoint;
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