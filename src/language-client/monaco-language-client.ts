import Uri = monaco.Uri;
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
        let uriConverters = MonacoLanguageClient.createUriConverters();
        let clientOptions: LanguageClientOptions = {
            initializationOptions,
            documentSelector,
            synchronize,
            uriConverters
        };
        let forceDebug: boolean = false;

        let client = new MonacoLanguageClient(id, serverOptions, clientOptions, forceDebug);
        return client;
    }

    static createUriConverters() {
        // todo: cleanup - inverse ops...
        return {
            code2Protocol(uri: Uri): string {
                let value = uri.toString();

                let SCHEME_PREFIX_FILE = 'file://';
                let SCHEME_PREFIX_HTTP = 'http://localhost:8080';
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
                let SCHEME_PREFIX_FILE = 'file://';
                let SCHEME_PREFIX_HTTP = 'http://localhost:8080';
                if (value.startsWith(SCHEME_PREFIX_FILE)) {
                    let uri = value.replace(SCHEME_PREFIX_FILE, SCHEME_PREFIX_HTTP);
                    return Uri.parse(uri);
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