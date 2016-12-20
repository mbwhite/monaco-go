console.log('stream');

import { assert } from 'chai';
import { Flow as Flow1 } from './messages/flow-1';
import { TestMessagePairs, ResponseRequest } from './messages/test-message';
import { WebSocketStream } from '../language-client/web-socket-stream';
import {
		DataCallback, Message, StreamInfo, MessageReader, MessageWriter
} from 'vscode-languageclient';

let context = describe('WebSocketStream', () => {
		beforeEach(() => {
		});

		let getMsgOnly = (data: string) => {
				if (data.length === 0) {
						return;
				}

				const CRLF = '\r\n';
				const SEPARATOR = `${CRLF}${CRLF}`;

				let response: string[] = data.split(SEPARATOR, 2);
				// let headers = response[0];
				let json = response[1];

				let msg: Message = JSON.parse(json);
				return msg;
		};

		it('WebSocketStream.create', (done) => {
				// do everything in here initiallly until code is cleaned up
				// to allow connecting and disconnecting from the langserver
				console.log('Flow1:', Flow1);

				let onCreate = (streamInfo: StreamInfo) => {
						assert.isOk(streamInfo.reader);
						assert.isOk(streamInfo.writer);

						let messageReader = <MessageReader>(<any>streamInfo.reader);
						let messageWriter = <MessageWriter>(<any>streamInfo.writer);

						let msgInit: ResponseRequest = Flow1.msgs[0];
						let request = msgInit.request;
						let response = msgInit.response;

						messageReader.listen((msg: Message) => {
								let actual = JSON.stringify(msg);
								let expected = getMsgOnly(response.toString());
								let expectedStr = JSON.stringify(getMsgOnly(response.toString()));

								assert.equal(actual, expectedStr);
								done();
						});

						// sent the init msg to the langserver
						let msg: Message = getMsgOnly(request.toString());
						messageWriter.write(msg);
				};

				WebSocketStream.create().then(onCreate).catch((err) => {
						let message = err.toString();
						assert.fail(0, 1, 'WebSocketStream.create - error: ' + message);
						done();
				});
		});

		it('flow-1', (done) => {
				// console.log('Flow1:', Flow1);
				// console.log('Flow1:', Flow1);

				let wsStream = WebSocketStream.create();
				done();
		});
});

let Test = {
		describe: context
};

export { Test }