export class MonacoOutputChannel {
	private _name: string = 'OutputChannel';
	private _hide: boolean;

	constructor(name: string = 'OutputChannel') {
		this._name = name;
		this._hide = true;
	}

	appendLine(value) {
		if (!this._hide) {
			let message = `LanguageClient:${this._name} - `;
			console.info(message, value);
		}
	}

	show(preserveFocus) {
		this._hide = false;
	}

	hide() {
		this._hide = true;
	}
}
