class MonacoGoOperationElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-operation';
	}

	static get config() {
		return {
			properties: {
				operationUiHooks: {
					type: MonacoGoOperationUiHooks,
					notify: true,
				},
				operation: {
					type: MonacoGoOperationInProgress,
					notify: true,
					value: () => {
						return new MonacoGoOperationInProgress();
					},
				},
			},
			observers: [
			]
		};
	}

	ready() {
		super.ready();

		this.operationUiHooks = this._createUIHooks();
		this.notifyPath('operationUiHooks')
	}

	_createUIHooks()  {
		let hooks = {
			onRequestStart: (details) => {
				this.operation.id = '';
				this.operation.details = '';

				if (details && details.msg) {
					let msg = details.msg;

					if (Number.isInteger(msg.id)) {
						this.operation.id = msg.id;
					}

					if (msg.result) {
						this.operation.params = JSON.stringify(msg.result);
					} else if (msg.method) {
						this.operation.params = JSON.stringify(msg.method);
					} else {
						this.operation.params = JSON.stringify(msg);
					}
				}

				if (details && details.msg && Number.isInteger(details.msg.id)) {
					this.operation.inProgress = true;
				}

				this.notifyPath('operation');
			},
			onRequestEnd: (details) => {
				this.operation.id = '';
				this.operation.details = '';

				if (details && details.msg) {
					let msg = details.msg;

					if (Number.isInteger(msg.id)) {
						this.operation.id = msg.id;
					}

					if (msg.result) {
						this.operation.params = JSON.stringify(msg.result);
					} else if (msg.method) {
						this.operation.params = JSON.stringify(msg.method);
					} else {
						this.operation.params = JSON.stringify(msg);
					}
				}

				if (details && details.msg && Number.isInteger(details.msg.id)) {
					this.operation.inProgress = false;
				}

				this.notifyPath('operation');
			},
			extra: {},
		};

		return new MonacoGoOperationUiHooks(
			hooks.onRequestStart,
			hooks.onRequestEnd,
			hooks.extra);
	}
}

customElements.define(MonacoGoOperationElement.is, MonacoGoOperationElement);