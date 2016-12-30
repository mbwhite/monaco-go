class MonacoGoLangserverConfigElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-langserver-config';
	}

	static get config() {
		return {
			properties: {
				langserverConfig: {
					type: MonacoGoLangserverConfig,
					notify: true,
				},
				isWorking: {
					type: Boolean,
					notify: true,
					value: () => {
						return false;
					},
				}
			}
		};
	}

	_onRefresh(e) {
		console.log('_onRefresh', e);
		// test
		this.isWorking = true;
		Polymer.Async.run(() => {
			this.isWorking = false;
		}, 3000);
	}
}

customElements.define(MonacoGoLangserverConfigElement.is, MonacoGoLangserverConfigElement);