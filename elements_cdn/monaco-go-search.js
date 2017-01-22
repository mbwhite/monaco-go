class MonacoGoSearchQuery {
	constructor(input = 'handler.go') {
		this.input = input;
	}

	reset() {
		this.input = 'handler.go'
	}
}

class MonacoGoSearchElement extends Polymer.Element {
	static get is() {
		return 'monaco-go-search';
	}

	static get config() {
		return {
			properties: {
				searchQuery: {
					type: MonacoGoSearchQuery,
					notify: true,
					value: () => {
						return new MonacoGoSearchQuery();
					},
				},
				inProgress: {
					type: Boolean,
					notify: true,
					value: () => {
						return false;
					},
				},
				showingSearch: {
					type: Boolean,
					notify: true,
					value: () => {
						return true;
					},
				},
			},
			observers: [
			]
		};
	}

	_toggleSearch() {
		this.showingSearch = !this.showingSearch;
	}

	_onSearch(e) {
		let input = this.searchQuery.input;

		this.inProgress = true;
		// do something with the input
		this.inProgress = false;
	}

	_onClear(e) {
		this.searchQuery.reset();
		this.notifyPath('searchQuery');
	}
}

customElements.define(MonacoGoSearchElement.is, MonacoGoSearchElement);