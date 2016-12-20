export class TestMessage {
	private _bytes: Uint8Array;
	constructor(bytes: number[]) {
		this._bytes = new Uint8Array(bytes);
	}

	toString() {
		let decoder = new TextDecoder();
		let decoded = decoder.decode(this._bytes);
		return decoded;
	}
}

export interface ResponseRequest {
	request: TestMessage;
	response: TestMessage;
};


/**
 * TestMessages
 */
export class TestMessages extends Array<ResponseRequest> {
	constructor() {
		super();
	}

	addPair(request: TestMessage, response: TestMessage) {
		this.push({
			request,
			response,
		});
	}
}