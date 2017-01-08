class MonacoGoLangserverConnection {
	constructor(state = 'waiting...') {
		this.state = state;
		this.logs = [
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

	_sortLog(logs, configConfig) {

	}
}

customElements.define(MonacoGoLangserverLogElement.is, MonacoGoLangserverLogElement);