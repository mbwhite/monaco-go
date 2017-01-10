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
		let drawer = this.$.drawer;
		if (drawer) {
			drawer.toggle();
		}
	}

	_onToggleDrawerEnd(e) {
		let drawer = this.$.drawerEnd;
		if (drawer) {
			drawer.toggle();
		}
	}
}

customElements.define(MonacoGoDrawerLayoutElement.is, MonacoGoDrawerLayoutElement);