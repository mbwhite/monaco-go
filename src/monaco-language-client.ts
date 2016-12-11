import {
	SynchronizeOptions,
	LanguageClientOptions,
	ServerOptions,
	LanguageClient,
	StreamInfo,
} from 'vscode-languageclient';

import {
	WebSocketStream
} from './web-socket-stream';

export class MonacoLanguageClient extends LanguageClient {
	constructor(id: string, serverOptions: ServerOptions, clientOptions: LanguageClientOptions, forceDebug: boolean = false) {
		super(id, serverOptions, clientOptions, forceDebug);
	}

	static create(): LanguageClient {
		let id = 'langserver-antha';
		let serverOptions: () => Thenable<StreamInfo> = () => {
			return WebSocketStream.create();
		};

		let synchronize: SynchronizeOptions = {
			configurationSection: null,
			fileEvents: null
		};
		let clientOptions: LanguageClientOptions = {

			documentSelector: ['go'],
			synchronize,
		};
		let forceDebug: boolean = false;

		let client = new MonacoLanguageClient(id, serverOptions, clientOptions, forceDebug);
		return client;
	}
}