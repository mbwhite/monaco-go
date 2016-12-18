// import 'mocha';
import { assert } from 'chai';
import { WebSocketMessageReader } from '../language-client/web-socket-reader';

suite('WebSocketMessageReader', () => {
	test('one message', () => {
		assert.equal(99, 100, 'one message');
	});

	test('many message', () => {
		assert.equal(100, 100, 'many message');
	});
});
