/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

interface CompletionItem {
	test: string;
};

class OutputChannel {
	constructor() {
		this.hide = true;
	}

	appendLine(value) {
		if (!this.hide) {
			console.info('LanguageClient: ', value);
		}
	}

	show(preserveFocus) {
		this.hide = false;
	}

	hide() {
		this.hide = true;

		console.info(message, optionalParams);
	}
}

class WorkspaceConfig {
	constructor(id = 'langserver-antha') {
		this.id = id;
		this.sections = {
			'trace.server': 'verbose'
		};
	}

	get(section, defaultValue) {
		try {
			let value = this.sections[section];

			if (value) {
				return value;
			} else {
				return defaultValue;
			}
		} catch(err) {
			return defaultValue;
		}
	}
}

class workspace {
	constructor(workspaceConfigs = [new WorkspaceConfig()]) {
		this.workspaceConfigs = workspaceConfigs;
	}

	getConfiguration(id) {
		return this.workspaceConfigs.filter((config) => {
			return config.id === id;
		});
	}
}

export { CompletionItem };