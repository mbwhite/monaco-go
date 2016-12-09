/// <reference path="./text-encoding.d.ts" />

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import {
	DataCallback,
	MessageWriter, MessageReader,
	Message, PartialMessageInfo,
	StreamInfo
} from 'vscode-languageclient';

export class Utils {
	private constructor() {
	}

	public static byteLength(input: string, encoding: string = 'utf-8') {
		// new TextEncoder('utf-8').encode('foo')).length
		let encoder = new TextEncoder(encoding).encode(input);
		let len = encoder.length;

		return len;
	}
}

export class WebSocketMessageReader implements MessageReader {
	private errorEmitter: Emitter<Error>;
	private closeEmitter: Emitter<void>;
	private partialMessageEmitter: Emitter<PartialMessageInfo>;
	private callback: DataCallback;

	public constructor(private ws: WebSocket) {
		this.errorEmitter = new Emitter<Error>();
		this.closeEmitter = new Emitter<void>();
		this.attachHandlers();
	}

	public listen(callback: DataCallback): void {
		this.callback = callback;
	}

	private attachHandlers() {
		this.ws.onmessage = (ev: MessageEvent) => {
			let data = ev.data ? ev.data : '';
			// data:
			// "Content-Length: 207\r\nContent-Type: application/vscode-jsonrpc; charset=utf8\r\n\r\n{\"id\":0,\"result\":{\"capabilities\":{\"textDocumentSync\":1,\"hoverProvider\":true,\"definitionProvider\":true,\"referencesProvider\":true,\"documentSymbolProvider\":true,\"workspaceSymbolProvider\":true}},\"jsonrpc\":\"2.0\"}"

			if (!this.callback || typeof data !== 'string') {
				// noop
			} else {
				this.onMessage(data);
			}
		};
	}

	private onMessage(data: string) {
		if (data.length === 0) {
			return;
		}

		const CRLF = '\r\n';
		const SEPARATOR = `${CRLF}${CRLF}`;

		let response: string[] = data.split(SEPARATOR, 2);
		// let headers = response[0];
		let json = response[1];

		let msg: Message = JSON.parse(json);
		// let msg = JSON.parse(json);
		this.callback(msg);
	}

	public get onError(): IEvent<Error> {
		return this.errorEmitter.event;
	}

	public get onClose(): IEvent<void> {
		return this.closeEmitter.event;
	}

	public get onPartialMessage(): IEvent<PartialMessageInfo> {
		return this.partialMessageEmitter.event;
	}
}

export class WebSocketMessageWriter implements MessageWriter {
	private errorEmitter: Emitter<[Error, Message, number]>;
	private closeEmitter: Emitter<void>;

	public constructor(private ws: WebSocket) {
		this.errorEmitter = new Emitter<[Error, Message, number]>();
		this.closeEmitter = new Emitter<void>();
	}

	public write(msg: Message): void {
		let json: string = JSON.stringify(msg);
		let data = this.toRpc(json);

		this.ws.send(data);
	}

	private toRpc(json: string) {
		const CONTENT_LENGTH: string = 'Content-Length: ';
		const CRLF = '\r\n';
		let encoding = 'utf-8';

		let contentLength = Utils.byteLength(json, encoding);
		let contents: string[] = [
			CONTENT_LENGTH, contentLength.toString(), CRLF, CRLF,
			json
		];

		let rpc: string = contents.join('');
		return rpc;
	}

	public get onError(): IEvent<[Error, Message, number]> {
		return this.errorEmitter.event;
	}

	public get onClose(): IEvent<void> {
		return this.closeEmitter.event;
	}
}

export class WebSocketStream implements StreamInfo {
	writer: any;
	reader: any;

	constructor(private ws: WebSocket) {
		this.writer = new WebSocketMessageWriter(ws);
		this.reader = new WebSocketMessageReader(ws);

		// this.writer = {
		// 	write(msg: lc.Message): void {
		// 		console.info('WebSocketStream:write - ', msg);
		// 		ws.send(msg);
		// 	},

		// 	onClose(closeHandler) {
		// 		ws.onclose = (ev: CloseEvent): any => {
		// 			console.info('writer:onclose: ', ev);
		// 		};
		// 	},
		// 	onError(writeErrorHandler) {
		// 		ws.onerror = (ev: ErrorEvent): any => {
		// 			console.info('writer:onerror: ', ev);
		// 		};
		// 	}
		// };
		// // listen(callback: DataCallback): void {
		// this.reader = {
		// 	listen(callback: lc.DataCallback): void {
		// 		ws.onmessage = (ev: MessageEvent): any => {
		// 			console.info('WebSocketStream:onmessage - ', ev.data, ev);
		// 		};
		// 	},

		// 	onClose(closeHandler) {
		// 		ws.onclose = (ev: CloseEvent): any => {
		// 			console.info('reader:onclose: ', ev);
		// 		};
		// 	},
		// 	onError(writeErrorHandler) {
		// 		ws.onerror = (ev: ErrorEvent): any => {
		// 			console.info('reader:onerror: ', ev);
		// 		};
		// 	}
		// };
	}
}

export function create(): Promise<StreamInfo> {
	return new Promise((resolve, reject) => {
		let ws: WebSocket;

		try {
			ws = new WebSocket('ws://localhost:4389');

			ws.onopen = (ev: Event): any => {
				let streamInfo: StreamInfo = new WebSocketStream(ws);
				resolve(streamInfo);
			};
		} catch (err) {
			reject(err);
		}

		ws.onclose = (ev: CloseEvent): any => {
			console.info('WebSocketStream:onclose - CloseEvent: ', ev);
		};
		ws.onerror = (ev: ErrorEvent): any => {
			console.info('WebSocketStream:onerror - ErrorEvent: ', ev);
			reject(ev.error);
		};
		ws.onmessage = (ev: MessageEvent): any => {
			console.info('WebSocketStream:onmessage - MessageEvent: ', ev);
		};
	});
}