import {
	DataCallback,
	MessageWriter, MessageReader,
	Message, PartialMessageInfo,
	StreamInfo
} from 'vscode-languageclient';
import {
	WebSocketMessageReader
} from './web-socket-reader';
import {
	WebSocketMessageWriter
} from './web-socket-writer';


export {
	WebSocketMessageReader, WebSocketMessageWriter
}

export class WebSocketStream implements StreamInfo {
	writer: any;
	reader: any;

	constructor(private ws: WebSocket) {
		this.writer = new WebSocketMessageWriter(ws);
		this.reader = new WebSocketMessageReader(ws);
	}

	static computeScheme() {
		let scheme = `ws`;
		return scheme;
	}

	static computeHost() {
		// use localhost in dev-mode.
		// otherwise use the azure host address
		let devMode = false;
		if (!devMode) {
			return '13.65.101.250';
			// return `go-langserver.cloudapp.net`;
		} else {
			return 'localhost';
		}
	}

	static createUrl() {
		let scheme = WebSocketStream.computeScheme();
		let host = WebSocketStream.computeHost();
		let port = `4389`;

		let url = `${scheme}://${host}:${port}`;
		return url;
	}

	static create(): Promise<StreamInfo> {
		return new Promise((resolve, reject) => {
			let ws: WebSocket;

			try {
				let url = WebSocketStream.createUrl();
				ws = new WebSocket(url);

				ws.onopen = (ev: Event): any => {
					let streamInfo: StreamInfo = new WebSocketStream(ws);
					resolve(streamInfo);
				};
			} catch (err) {
				reject(err);
			}

			ws.onclose = (ev: CloseEvent): any => {
				console.error('WebSocketStream:onclose - CloseEvent: ', ev);
				reject(ev);
			};
			ws.onerror = (ev: ErrorEvent): any => {
				console.error('WebSocketStream:onerror - ErrorEvent: ', ev);
				reject(ev);
			};
			ws.onmessage = (ev: MessageEvent): any => {
				// console.info('WebSocketStream:onmessage - MessageEvent: ', ev);
			};
		});
	}
}