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
import { UIHooks } from '../monaco.contribution';

export class WebSocketMessageWriter implements MessageWriter {
	private _logMsgs: boolean = false;

	private _errorEmitter: Emitter<[Error, Message, number]>;
	private _closeEmitter: Emitter<void>;

	private _encoder = new TextEncoder();
	private _decoder = new TextDecoder();

	constructor(private ws: WebSocket, private uiHooks: UIHooks) {
		this._errorEmitter = new Emitter<[Error, Message, number]>();
		this._closeEmitter = new Emitter<void>();
	}

	write(msg: Message): void {
		let json: string = JSON.stringify(msg);
		let data = this.toRpc(json);

		this.logMsg(data);

		if (this.uiHooks) {
			let send: any = msg;
			let id = send && send.id ? send.id : '';
			let details = {
				id,
				msg,
			};
			this.uiHooks.onRequestStart(details);
		}

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

	private logMsg(data: string) {
		if (!this._logMsgs) {
			return;
		}

		let encoded = this._encoder.encode(data);
		let encodedBytes = (encoded ? encoded : []).toString();
		let decoded = this._decoder.decode(encoded);

		console.log('WebSocketMessageWriter:send');
		console.log('[%s]', encodedBytes);
		console.log(decoded);
	}

	get onError(): IEvent<[Error, Message, number]> {
		return this._errorEmitter.event;
	}

	get onClose(): IEvent<void> {
		return this._closeEmitter.event;
	}
}