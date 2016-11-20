import {
    LanguageClient,
    LanguageClientOptions,
    SynchronizeOptions,
    InitializationFailedHandler,
    SettingMonitor, ServerOptions, ErrorAction,
    ErrorHandler,
    CloseAction,
    TransportKind
} from 'vscode-languageclient';
import {
    Message
} from 'vscode-jsonrpc';
import {
    TextDocument
} from 'vscode-languageserver-types';
import Uri from 'vscode-uri';

export class GoLanguageClient {
    private _client: LanguageClient;
    constructor() {
        this._init();
    }

    private _init() {
        let name = 'langserver-go';
        let serverOptions: ServerOptions = {
            command: 'langserver-go',
            args: [
                '-mode=stdio',
                // Uncomment for verbose logging to the vscode
                // "Output" pane and to a temporary file:
                //
                // '-trace', '-logfile=/tmp/langserver-go.log',
            ],
        };
        let clientOptions = this._makeClientOptions();
        let forceDebug: boolean = true;

        this._client = new LanguageClient(name, serverOptions, clientOptions, forceDebug);
    }

    private _makeClientOptions() {
        let clientOptions: LanguageClientOptions;

        let synchronize: SynchronizeOptions = {
            // configurationSection?: string | string[];
            configurationSection: null,
            // fileEvents?: FileSystemWatcher | FileSystemWatcher[];
            fileEvents: null,
            // textDocumentFilter?: (textDocument: TextDocument) => boolean;
            textDocumentFilter: null
        };
        let initializationOptions = () => {
            return null;
        };
        let initializationFailedHandler: InitializationFailedHandler = () => {
            return null;
        };
        let errorHandler: ErrorHandler = {
            error(error: Error, message: Message, count: number): ErrorAction {
                return ErrorAction.Continue;
                // return ErrorAction.Shutdown;
            },
            closed(): CloseAction {
                return CloseAction.DoNotRestart;
                // return CloseAction.Restart;
            }
        };
        let code2Protocol: typeof clientOptions.uriConverters.code2Protocol = (value: Uri): string => {
            return '';
        };
        let protocol2Code: typeof clientOptions.uriConverters.protocol2Code = (value: string): Uri => {
            return Uri.parse('');
        };
        let uriConverters: typeof clientOptions.uriConverters = {
            code2Protocol,
            protocol2Code
        };

        clientOptions = {
            documentSelector: ['go'],
            synchronize,
            diagnosticCollectionName: null,
            outputChannelName: null,
            stdioEncoding: null,
            initializationOptions,
            initializationFailedHandler,
            errorHandler,
            // uriConverters: {
            //     // Apply file:/// scheme to all file paths.
            //     code2Protocol: (uri: Uri): string => (uri.scheme ? uri : uri.with({ scheme: 'file' })).toString(),
            //     protocol2Code: (uri: string) => Uri.parse(uri),
            // },
            uriConverters
        };

        return clientOptions;
    }
}