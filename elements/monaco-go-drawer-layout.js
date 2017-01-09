class MonacoGoDrawerLayoutElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-drawer-layout';
	}

	static get config() {
		return {
			properties: {
				selectionFile: {
					type: MonacoGoProjectFile,
				},
				selectionProject: {
					type: MonacoGoProjectRepo,
				},
				langserverConfig: {
					type: MonacoGoLangserverConfig,
					notify: true,
					value: () => {
						return new MonacoGoLangserverConfig();
					}
				}
			}
		};
	}

	// event handlers

	_onToggleDrawer(e) {
		// document.getElementById('drawer').toggle()
		let drawer = this.$.drawer;
		if (this.$.drawer) {
			drawer.toggle();
		}
	}

	_onSearch(e) {

	}
}

customElements.define(MonacoGoDrawerLayoutElement.is, MonacoGoDrawerLayoutElement);