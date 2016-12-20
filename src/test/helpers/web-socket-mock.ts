// todo: remove this - no longer needed.

export class WebSocketMock {
	private _callbacks: any = [];

	constructor() {
	}

	set onmessage(callback) {
		let entry = callback;
		this._callbacks.push(entry);
	}

	fireOnMessage(messages: string[]) {
		return this._callbacks.map((callback) => {
			return messages.map((message) => {
				// let ev: MessageEvent
				let ev = {
					data: message
				};
				callback(ev);
			});
		});
	}
}