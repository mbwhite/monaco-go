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

			if (content.type === 'dir') {
				let file = new MonacoGoProjectFile(name, download_url, 'dir');
				files.push(file);
			} else if (content.type === 'file') {
				 let file = new MonacoGoProjectFile(name, download_url);
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