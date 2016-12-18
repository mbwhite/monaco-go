import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import {
	DataCallback,
	MessageWriter, MessageReader,
	Message, PartialMessageInfo,
	StreamInfo
} from 'vscode-languageclient';

export class WebSocketMessageReader implements MessageReader {
	private errorEmitter: Emitter<Error>;
	private closeEmitter: Emitter<void>;
	private partialMessageEmitter: Emitter<PartialMessageInfo>;
	private callback: DataCallback;

	constructor(private ws: WebSocket) {
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
				this.handleMessages(data);
			}
		};
	}

	private handleMessages(data: string) {
		let msgs = this.splitMessages(data);

		// console.info('WebSocketMessageReader:onmessage - msgs.length ', msgs.length);
		msgs.map((data) => {
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
			msgs.push( msg );
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
		this.callback(msg);
	}

	get onError(): IEvent<Error> {
		return this.errorEmitter.event;
	}

	get onClose(): IEvent<void> {
		return this.closeEmitter.event;
	}

	get onPartialMessage(): IEvent<PartialMessageInfo> {
		return this.partialMessageEmitter.event;
	}
}
