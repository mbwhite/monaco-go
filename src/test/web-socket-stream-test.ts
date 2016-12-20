console.log('stream');

import { assert } from 'chai';
import { Flow as Flow1 } from './messages/flow-1';
import { WebSocketStream } from '../language-client/web-socket-stream';
import { DataCallback, Message } from 'vscode-languageclient';

let context = describe('WebSocketStream', () => {
	beforeEach(() => {
	});

	it('flow-1', (done) => {
		let wsStream = WebSocketStream.create();
		done();
	});
});

let Test = {
	describe: context
};

export { Test }