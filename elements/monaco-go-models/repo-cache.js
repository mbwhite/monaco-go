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