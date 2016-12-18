import 'mocha';
import { assert } from 'chai';
import './helpers/monaco-mock';
import { WebSocketMock } from './helpers/web-socket-mock';
import { TestMessages } from './helpers/messages';
import { WebSocketMessageReader } from '../language-client/web-socket-reader';

suite('WebSocketMessageReader', () => {
	let ws: WebSocketMock;
	let reader: WebSocketMessageReader;

	beforeEach(() => {
		ws = new WebSocketMock();
		reader = new WebSocketMessageReader(<any>ws);
	});

	test('many message', () => {
		assert.equal(100, 100, 'many message');
	});

	test('failing test', () => {
		assert.equal(1, 2, '1 != 2');
	});
});
