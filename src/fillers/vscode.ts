import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import IModel = monaco.editor.IModel;

import {
	DocumentSelector, DocumentFilter,
	DidOpenTextDocumentParams
} from 'vscode-languageclient';
import {
	TextDocumentItem
} from 'vscode-languageserver-types';

declare type TextDocument = IModel;

// todo: need to implemennt the rest of these CanvasPathMethods. see this file,
// http://127.0.0.1:8080/node_modules/vscode-languageclient/src/codeConverter.ts.
//
// textDocument: TextDocumentItem
//
// 	function asOpenTextDocumentParams(textDocument: code.TextDocument): proto.DidOpenTextDocumentParams {
// 		return {
// 			textDocument: {
// 				uri: _uriConverter(textDocument.uri),
// 				languageId: textDocument.languageId,
// 				version: textDocument.version,
// 				text: textDocument.getText()
// 			}
// 		};
// 	}

// class TextDocumentImpl implements IModel {
class TextDocumentImpl {
	public constructor() {
	}

    /**
     * An item to transfer a text document from the client to the
     * server.
     */
	// export interface TextDocumentItem {

	/**
	 * The text document's uri.
	 */
	public get uri(): string {
		return '';
	}
	/**
	 * The text document's language identifier
	 */
	public get languageId(): string {
		return '';
	}
	/**
	 * The version number of this document (it will strictly increase after each
	 * change, including undo/redo).
	 */
	public get version(): number {
		return 0;
	}
	/**
	 * The content of the opened text document.
	 */
	public get text(): string {
		return '';
	}

	// }
}

class OutputChannel {
	private _name: string = 'OutputChannel';
	private _hide: boolean;

	public constructor(name: string = 'OutputChannel') {
		this._name = name;
		this._hide = true;
	}

	public appendLine(value) {
		if (!this._hide) {
			let message = `LanguageClient:${this._name} - `;
			console.info(message, value);
		}
	}

	public show(preserveFocus) {
		this._hide = false;
	}

	public hide() {
		this._hide = true;
	}
}

class WorkspaceConfig {
	private _id: string = 'langserver-antha';
	private _sections: {};

	public constructor(id: string = 'langserver-antha') {
		this._id = id;
		this._sections = {
			'trace.server': 'verbose'
		};
	}

	public get id() {
		return this._id;
	}

	public get(section, defaultValue) {
		try {
			let value = this._sections[section];

			if (value) {
				return value;
			} else {
				return defaultValue;
			}
		} catch (err) {
			return defaultValue;
		}
	}
}

class Workspace {
	private _workspaceConfigs: WorkspaceConfig[];
	private _textDocuments: TextDocument[];
	private _onDidOpenTextDocument = new Emitter<TextDocument>();

	public rootPath: string;

	public constructor(
		rootPath: string = '/Users/mbana/go/src/github.com/sourcegraph/go-langserver',
		workspaceConfigs: WorkspaceConfig[] = [new WorkspaceConfig()]
	) {
		this.rootPath = rootPath;
		this._workspaceConfigs = workspaceConfigs;
		this._textDocuments = [];

		monaco.editor.onDidCreateModel(this._onModelAdd);
		monaco.editor.getModels().forEach(this._onModelAdd, this);
	}

	private _onModelAdd(model: monaco.editor.IModel): void {
		// let modeId = model.getModeId();

		// let handle: number;
		// this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
		// 	clearTimeout(handle);
		// 	handle = window.setTimeout(() => this._doValidate(model.uri, modeId), 500);
		// });

		// this._doValidate(model.uri, modeId);

		this._textDocuments.push(model);
		this._onDidOpenTextDocument.fire(model);
	}

	public get onDidOpenTextDocument(): IEvent<TextDocument> {
		return this._onDidOpenTextDocument.event;
	}

	public get textDocuments() {
		return this._textDocuments;
	}

	public getConfiguration(id: string): WorkspaceConfig | undefined {
		return this._workspaceConfigs.find((config: WorkspaceConfig) => {
			return config.id === id;
		});
	}
}

class MonacoWindow {
	constructor() {
	}

	createOutputChannel(name) {
		return new OutputChannel(name);
	}

	showErrorMessage(message: string, ...items: string[]) {
		console.error(message, ...items);
		return Promise.resolve();
	}

	showInformationMessage(message: string, ...items: string[]) {
		console.info(message, ...items);
		return Promise.resolve();
	}

	showWarningMessage(message: string, ...items: string[]) {
		console.warn(message, ...items);
		return Promise.resolve();
	}
}



class MonacoLanguages {
	constructor() {

	}

	// see this file:
	// https://github.com/Microsoft/vscode/blob/c67ef57cda90b5f28499646f7cc94e8dcc5b0586/src/vs/editor/common/modes/languageSelector.ts

	/**
	 * Compute the match between a document [selector](#DocumentSelector) and a document. Values
	 * greater than zero mean the selector matches the document. The more individual matches a selector
	 * and a document have, the higher the score is. These are the abstract rules given a `selector`:
	 *
	 * ```
	 * (1) When selector is an array, return the maximum individual result.
	 * (2) When selector is a string match that against the [languageId](#TextDocument.languageId).
	 * 	(2.1) When both are equal score is `10`,
	 * 	(2.2) When the selector is `*` score is `5`,
	 * 	(2.3) Else score is `0`.
	 * (3) When selector is a [filter](#DocumentFilter) return the maximum individual score given that each score is `>0`.
	 *	(3.1) When [language](#DocumentFilter.language) is set apply rules from #2, when `0` the total score is `0`.
	 *	(3.2) When [scheme](#DocumentFilter.scheme) is set and equals the [uri](#TextDocument.uri)-scheme score with `10`, else the total score is `0`.
	 *	(3.3) When [pattern](#DocumentFilter.pattern) is set
	 * 		(3.3.1) pattern equals the [uri](#TextDocument.uri)-fsPath score with `10`,
	 *		(3.3.1) if the pattern matches as glob-pattern score with `5`,
	 *		(3.3.1) the total score is `0`
	 * ```
	 *
	 * @param selector A document selector.
	 * @param document A text document.
	 * @return A number `>0` when the selector matches and `0` when the selector does not match.
	 */
	public match(selector: DocumentSelector, document: TextDocument): number {
		if (Array.isArray(selector)) {
			// for each
			let values = (<DocumentSelector[]>selector).map(item => this._match(item, document));
			return Math.max(...values);
		} else if (typeof selector === 'string') {
			return this._match(selector, document);
		} else {
			return 0;
		}
	}

	private _match(selector: DocumentSelector, document: TextDocument) {
		if (typeof selector === 'string') {
			let modeId = document.getModeId();
			return modeId === selector ? 1 : 0;
		} else {
			return 0;
		}
	}

	/**
	 * Create a diagnostics collection.
	 *
	 * @param name The [name](#DiagnosticCollection.name) of the collection.
	 * @return A new diagnostic collection.
	 */
	public createDiagnosticCollection() {
		return {};
	}
}

export function CompletionItem() { };

export function CodeLens() { };

export function Disposable() { };

export const workspace = new Workspace();
export const window = new MonacoWindow();
export const languages = new MonacoLanguages();