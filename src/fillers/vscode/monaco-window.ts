import {
	MonacoOutputChannel
} from './monaco-output-channel';

export class MonacoWindow {
	constructor() {
	}

	createOutputChannel(name) {
		return new MonacoOutputChannel(name);
	}

	showErrorMessage(message: string, ...items: string[]) {
		console.error(message, ...items);
		return Promise.resolve();
	}

	showInformationMessage(message: string, ...items: string[]) {
		console.info(message, ...items);
		return Promise.resolve();
	}

	showWarningMessage(message: string, ...items: string[]) {
		console.warn(message, ...items);
		return Promise.resolve();
	}
}