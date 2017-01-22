class MonacoGoLangserverConfig {
	static GOPATH() {
		return '/Users/mbana/go';
	}

	constructor(host = 'azure.bana.io', port = ':4389', rootPath) {
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