import 'mocha';
import { assert } from 'chai';
import './helpers/monaco-mock';
import { WebSocketMock } from './helpers/web-socket-mock';
import { TestMessages } from './helpers/messages';
import { WebSocketMessageReader } from '../language-client/web-socket-reader';
import { DataCallback, Message } from 'vscode-languageclient';

suite('WebSocketMessageReader', () => {
	let ws: WebSocketMock;
	let reader: WebSocketMessageReader;

	beforeEach(() => {
		ws = new WebSocketMock();
		reader = new WebSocketMessageReader(<any>ws);
	});

	test('init msg', () => {
		// attach callbacks
		let callback = (msg: Message) => {
			assert.isOk(msg, JSON.stringify(msg));
		};
		reader.listen(callback);

		ws.fireOnMessage([TestMessages.INIT]);
	});

	test('many msg', () => {
		let callback = (msg: Message) => {
			assert.isOk(msg, JSON.stringify(msg));
		};
		reader.listen(callback);

		ws.fireOnMessage([TestMessages.MANY]);
	});
});
