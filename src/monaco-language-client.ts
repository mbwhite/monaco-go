import * as lc from 'vscode-languageclient';
import * as WebSocketStream from './web-socket-stream';

export function create(): lc.LanguageClient {
	let serverOptions: () => Thenable<lc.StreamInfo> = () => {
		return WebSocketStream.create();
	};
	let clientOptions: lc.LanguageClientOptions = {
	};
	let forceDebug: boolean = false;

	let client = new lc.LanguageClient('langserver-antha', serverOptions, clientOptions, forceDebug);
	return client;
}