import { assert } from 'chai';
import { WebSocketMock } from './helpers/web-socket-mock';
import { TestMessages } from './messages/messages';
import { WebSocketMessageReader } from '../language-client/web-socket-reader';
import { DataCallback, Message } from 'vscode-languageclient';

let context = describe('WebSocketMessageReader', () => {
	let ws: WebSocketMock;
	let reader: WebSocketMessageReader;

	beforeEach(() => {
		ws = new WebSocketMock();
		reader = new WebSocketMessageReader(<any>ws);
	});

	it('init msg', (done) => {
		// attach callbacks
		let callback = (msg: Message) => {
			assert.isOk(msg, JSON.stringify(msg));
		};
		reader.listen(callback);

		ws.fireOnMessage([TestMessages.INIT]);

		done();
	});

	it('many msg', (done) => {
		let callback = (msg: Message) => {
			assert.isOk(msg, JSON.stringify(msg));
		};
		reader.listen(callback);

		ws.fireOnMessage([TestMessages.MANY]);

		done();
	});
});

let Test = {
	describe: context
};

export { Test }