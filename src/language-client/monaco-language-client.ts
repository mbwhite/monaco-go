import Uri = monaco.Uri;
import {
	SynchronizeOptions,
	LanguageClientOptions,
	ServerOptions,
	LanguageClient,
	StreamInfo,
	DocumentSelector,
	CloseAction, ErrorAction, ResponseError, InitializeError, ErrorHandler, InitializationFailedHandler,
	Message,
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

		// let initializationOptions = {
		// 	'rootImportPath': 'github.com/sourcegraph/go-langserver/langserver/',
		// 	'GOPATH': '/go',
		// 	'GOROOT': '/usr/local/opt/go/libexec',
		// };
		let documentSelector: DocumentSelector = ['go'];
		let initializationFailedHandler = MonacoLanguageClient.createInitializationFailedHandler();
		let errorHandler = MonacoLanguageClient.createErrorHandler();
		let synchronize: SynchronizeOptions = {
			configurationSection: null,
			fileEvents: null
		};
		let uriConverters = MonacoLanguageClient.createUriConverters();
		let clientOptions: LanguageClientOptions = {
			documentSelector,
			synchronize,
			// initializationOptions,
			initializationFailedHandler,
			errorHandler,
			uriConverters,
		};
		let forceDebug: boolean = false;

		let client = new MonacoLanguageClient(id, serverOptions, clientOptions, forceDebug);
		return client;
	}

	private static createInitializationFailedHandler(): InitializationFailedHandler {
		return (error: ResponseError<InitializeError> | Error | any): boolean => {
			console.error('MonacoLanguageClient: ', error);
			// return false to terminate the LanguageClient
			return false;
		};
	}

	private static createErrorHandler(): ErrorHandler {
		// shutdown then restart the server...
		return {
			error(error: Error, message: Message, count: number): ErrorAction {
				console.error('MonacoLanguageClient: ', error, message, count);
				return ErrorAction.Shutdown;
			},
			closed(): CloseAction {
				return CloseAction.DoNotRestart;
			}
		};
	}

	static createUriConverters() {
		let SCHEME_PREFIX_FILE = 'file://';
		let SCHEME_PREFIX_HTTP = 'http:';

		// todo: cleanup - inverse ops...
		return {
			code2Protocol(uri: Uri): string {
				let value = uri.toString();
				if (value.startsWith(SCHEME_PREFIX_HTTP)) {
					let uri = value.replace(SCHEME_PREFIX_HTTP, SCHEME_PREFIX_FILE);
					return uri;
				} else {
					return value;
				}
			},
			protocol2Code(value: string): Uri {
				// not ideal: replace the file:// scheme that is returned by
				// the langserver to http:// for monaco to load model
				if (value.startsWith(SCHEME_PREFIX_FILE)) {
					let noPrefix = value.replace(SCHEME_PREFIX_FILE, SCHEME_PREFIX_HTTP);
					let uri = Uri.parse(noPrefix);
					return uri;
				} else {
					return Uri.parse(value);
				}
			}
		};
	}
}

// BuildContext: &InitializeBuildContextParams{
// 					GOOS:     "linux",
// 					GOARCH:   "amd64",
// 					GOPATH:   "/",
// 					GOROOT:   "/goroot",
// 					Compiler: runtime.Compiler,
// 				},