class MonacoGoLangserverLogEntry {
	constructor(msg, date = new Date()) {
		this.msg = msg;
		this.date = date;
	}
}

class MonacoGoLangserverLogsCollection extends Array {
	constructor() {
		super();
	}
}

class MonacoGoLangserverConnection {
	constructor(state = 'waiting...') {
		this.state = state;
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
				selectionLog: {
					type: MonacoGoLangserverLogEntry,
					notify: true,
				},
				langserverConn: {
					type: MonacoGoLangserverConnection,
					notify: true,
					value: () => {
						return new MonacoGoLangserverConnection();
					}
				},
				langserverLogCollection: {
					type: MonacoGoLangserverLogsCollection,
					notify: true,
					value: () => {
						return new MonacoGoLangserverLogsCollection();
					},
				},
				sortConfig: {
					type: MonacoGoLangserverConnectionLogSortConfig,
					notify: true,
					value: () => {
						return new MonacoGoLangserverConnectionLogSortConfig();
					}
				},

				// setInterval id
				// how long to wait before checking the log again
				intervalCheckId: {
					type: Number
				},
				intervalCheckPeriod: {
					type: Number,
					value: () => {
						return 1000;
					}
				},
			},
			observers: [
			],
		};
	}

	ready() {
		super.ready();

		let timeout = this.intervalCheckPeriod;
		this.intervalCheckId = setInterval(this._logCheckCallback.bind(this), timeout);
	}

	_logCheckCallback() {
		if (!GlobalMonacoOutputChannelStore) {
			return;
		}

		let logCountOld = this.langserverLogCollection.length;
		let logCountNew = GlobalMonacoOutputChannelStore.length;
		let newItemsCount = logCountNew - logCountOld;

		if (newItemsCount) {
			setTimeout(() => {
				// possibly include newItemsCount in here as well
				let currentSize = logCountOld ? logCountOld - 1 : logCountOld;
				let newItems = GlobalMonacoOutputChannelStore.slice(currentSize);

				let logEntries = newItems.forEach((log) => {
					let msg = `${log.value} - ${log.message}`;
					let entry = new MonacoGoLangserverLogEntry(msg);

					this.langserverLogCollection.unshift(entry);
					// this.langserverLogCollection.push(entry);
				});

				this.notifyPath('langserverLogCollection');
			}, 250);
		}
	}

	_formatDate(date) {
		let formatted = 'empty';
		if (date) {
			let timeStr = date.toLocaleTimeString();
			let dateStr = date.toLocaleDateString();
			formatted = `${timeStr} ${dateStr}`;
		}
		return formatted;
	}
}

customElements.define(MonacoGoLangserverLogElement.is, MonacoGoLangserverLogElement);