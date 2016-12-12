/// <reference path="./text-encoding.d.ts" />

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import {
	DataCallback,
	MessageWriter, MessageReader,
	Message, PartialMessageInfo,
	StreamInfo
} from 'vscode-languageclient';
import {
	Utils
} from './utils';

export class WebSocketMessageWriter implements MessageWriter {
	private errorEmitter: Emitter<[Error, Message, number]>;
	private closeEmitter: Emitter<void>;

	constructor(private ws: WebSocket) {
		this.errorEmitter = new Emitter<[Error, Message, number]>();
		this.closeEmitter = new Emitter<void>();
	}

	write(msg: Message): void {
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

	get onError(): IEvent<[Error, Message, number]> {
		return this.errorEmitter.event;
	}

	get onClose(): IEvent<void> {
		return this.closeEmitter.event;
	}
}