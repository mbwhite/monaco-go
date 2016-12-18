import 'mocha';
import { assert } from 'chai';
import './helpers/monaco-mock';
import { WebSocketMock } from './helpers/web-socket-mock';
import { TestMessages } from './helpers/messages';
import { WebSocketMessageReader } from '../language-client/web-socket-reader';
import {
	DataCallback, Message
} from 'vscode-languageclient';

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
			assert.isOk(msg, JSON.stringify((msg));
		};
		reader.listen(callback);

		ws.fireOnMessage([TestMessages.INIT]);
	});

	// test('many msgs', (done) => {
	// 	let MSGS = TestMessages.MANY;
	// 	const MSG_COUNT = MSGS.length;

	// 	let msgCount = 0;
	// 	// attach callbacks
	// 	let callback = (msg: Message) => {
	// 		console.log(JSON.stringify(msg));
	// 		console.log(msg);

	// 		assert.isNotOk(msg, JSON.stringify(msg));

	// 		if (MSG_COUNT === msgCount) {
	// 			done();
	// 		} else {
	// 			msgCount++;
	// 		}
	// 	};
	// 	reader.listen(callback);

	// 	ws.fireOnMessage(MSGS);
	// });
});
