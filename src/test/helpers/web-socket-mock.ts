export class WebSocketMock {
	private _callbacks: any = [];

	constructor() {
	}

	set onmessage(callback) {
		let entry = callback;
		this._callbacks.push[entry];
	}

	fireOnMessage(messages: string[]) {
		this._callbacks.forEach((callback) => {
			messages.forEach((message) => {
				// let ev: MessageEvent
				let ev = {
					data: message
				};
				callback(ev);
			});
		});
	}
}