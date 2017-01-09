export class MonacoOutputChannel {
	private _name: string = 'OutputChannel';
	private _hide: boolean;

	constructor(name: string = 'OutputChannel') {
		this._name = name;
		this._hide = true;
	}

	appendLine(value) {
		let message = `LanguageClient:${this._name} - `;
		if (!this._hide) {
			console.info(message, value);
		}

		return {
			message,
			value,
		};
	}

	show(preserveFocus) {
		this._hide = false;
	}

	hide() {
		this._hide = true;
	}
}
