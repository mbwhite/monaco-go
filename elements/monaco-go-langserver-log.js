class MonacoGoLangserverLogEntry {
	constructor(msg, date = new Date()) {
		this.msg = msg;
		this.date = date;
	}
}

class MonacoGoLangserverLogsCollection {
	constructor() {
	}
}

class MonacoGoLangserverConnection {
	constructor(state = 'waiting...') {
		this.state = state;
		// this.logs = new MonacoGoLangserverLogsCollection();
		this.logs = [
			new MonacoGoLangserverLogEntry('Booting monaco-go')
		];
	}
}

class MonacoGoLangserverConnectionLogSortConfig {
	constructor() {
		this.descending = true;
	}
}

class MonacoGoLangserverLogElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-langserver-log';
	}

	static get config() {
		return {
			properties: {
				langserverConn: {
					type: MonacoGoLangserverConnection,
					notify: true,
					value: () => {
						return new MonacoGoLangserverConnection();
					}
				},
				sortConfig: {
					type: MonacoGoLangserverConnectionLogSortConfig,
					notify: true,
					value: () => {
						return new MonacoGoLangserverConnectionLogSortConfig();
					}
				}
			},
			observers: [
			],
		};
	}

	_sortLog(logs, sortConfig) {
		// todo:
		// apply sortConfig to the logs collection
		// console.log('_sortLog - logs: %O, sortConfig: %O', logs, sortConfig);

		return this.langserverConn.logs;
	}
}

customElements.define(MonacoGoLangserverLogElement.is, MonacoGoLangserverLogElement);