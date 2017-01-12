import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import {
	DataCallback,
	MessageWriter, MessageReader,
	Message, PartialMessageInfo,
	StreamInfo
} from 'vscode-languageclient';
import { UIHooks } from '../monaco.contribution';

export class WebSocketMessageReader implements MessageReader {
	private _logMsgs: boolean = false;

	private _errorEmitter: Emitter<Error>;
	private _closeEmitter: Emitter<void>;
	private _partialMessageEmitter: Emitter<PartialMessageInfo>;
	private _callback: DataCallback;

	private _encoder = new TextEncoder();
	private _decoder = new TextDecoder();

	constructor(private ws: WebSocket, private uiHooks: UIHooks) {
		this._errorEmitter = new Emitter<Error>();
		this._closeEmitter = new Emitter<void>();
		this.attachHandlers();
	}

	public listen(callback: DataCallback): void {
		this._callback = callback;
	}

	private attachHandlers() {
		this.ws.onmessage = (ev: MessageEvent) => {
			let data = ev.data ? ev.data : '';
			// data:
			// "Content-Length: 207\r\nContent-Type: application/vscode-jsonrpc; charset=utf8\r\n\r\n{\"id\":0,\"result\":{\"capabilities\":{\"textDocumentSync\":1,\"hoverProvider\":true,\"definitionProvider\":true,\"referencesProvider\":true,\"documentSymbolProvider\":true,\"workspaceSymbolProvider\":true}},\"jsonrpc\":\"2.0\"}"

			if (!this._callback || typeof data !== 'string') {
				// noop
			} else {
				this.logMsg(data);
				this.handleMessages(data);
			}
		};
	}

	private logMsg(data: string) {
		if (!this._logMsgs) {
			return;
		}

		let encoded = this._encoder.encode(data);
		let encodedBytes = (encoded ? encoded : []).toString();
		let decoded = this._decoder.decode(encoded);

		console.log('WebSocketMessageReader:onmessage');
		console.log('[%s]', encodedBytes);
		console.log(decoded);
	}

	private handleMessages(data: string) {
		let msgs = this.splitMessages(data);

		// console.info('WebSocketMessageReader:onmessage - msgs.length ', msgs.length);
		msgs.map((data) => {
			// this.logMsg(data);
			this.handleJsonRpcMessage(data);
		});
	}

	private splitMessages(data: string) {
		const searchString = 'Content-Length:';

		let msgs = [];

		let from = data.indexOf(searchString, 0);
		for (let end = 0; end !== -1; ) {
			end = data.indexOf(searchString, from + 1);
			let msg: string;
			if (end === -1) {
				msg = data.substring(from);
			} else {
				msg = data.substring(from, end);
			}

			from = end;
			msgs.push(msg);
		}

		return msgs;
	}

	private handleJsonRpcMessage(data: string) {
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
		this._callback(msg);

		if (this.uiHooks) {
			let recv: any = msg;
			let id = recv && recv.id ? recv.id : '';
			let details = {
				id,
				msg,
			};
			this.uiHooks.onRequestEnd(details);
		}
	}

	get onError(): IEvent<Error> {
		return this._errorEmitter.event;
	}

	get onClose(): IEvent<void> {
		return this._closeEmitter.event;
	}

	get onPartialMessage(): IEvent<PartialMessageInfo> {
		return this._partialMessageEmitter.event;
	}
}
