import {
	SynchronizeOptions,
	LanguageClientOptions,
	ServerOptions,
	LanguageClient,
	StreamInfo,
	DocumentSelector,
} from 'vscode-languageclient';

import {
	WebSocketStream
} from './web-socket-stream';

import * as languageFeatures from '../languageFeatures';

export class MonacoLanguageClient extends LanguageClient {
	constructor(id: string, serverOptions: ServerOptions, clientOptions: LanguageClientOptions, forceDebug: boolean = false) {
		super(id, serverOptions, clientOptions, forceDebug);
	}

	static create(): LanguageClient {
		let id = 'langserver-antha';
		let serverOptions: () => Thenable<StreamInfo> = () => {
			return WebSocketStream.create();
		};

		let initializationOptions = {
			'rootImportPath': 'github.com/sourcegraph/go-langserver/langserver',
			'GOPATH': '/Users/mbana/go',
			'GOROOT': '/usr/local/opt/go/libexec',
		};
		let documentSelector: DocumentSelector = ['go'];
		let synchronize: SynchronizeOptions = {
			configurationSection: null,
			fileEvents: null
		};
		let clientOptions: LanguageClientOptions = {
			initializationOptions,
			documentSelector,
			synchronize,
		};
		let forceDebug: boolean = false;

		let client = new MonacoLanguageClient(id, serverOptions, clientOptions, forceDebug);
		return client;
	}
}

// BuildContext: &InitializeBuildContextParams{
// 					GOOS:     "linux",
// 					GOARCH:   "amd64",
// 					GOPATH:   "/",
// 					GOROOT:   "/goroot",
// 					Compiler: runtime.Compiler,
// 				},