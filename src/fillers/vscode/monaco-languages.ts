import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import Uri = monaco.Uri;
import Disposable = monaco.IDisposable;
import Position = monaco.Position;
import CancellationToken = monaco.CancellationToken;
import Thenable = monaco.Thenable;
import Definition = monaco.languages.Definition;
import Hover = monaco.languages.Hover;
import HoverProvider = monaco.languages.HoverProvider;
import DefinitionProvider = monaco.languages.DefinitionProvider;
import ReferenceProvider = monaco.languages.ReferenceProvider;
import ReferenceContext = monaco.languages.ReferenceContext;
import DocumentSymbolProvider = monaco.languages.DocumentSymbolProvider;
// import WorkspaceSymbolProvider = monaco.languages.WorkspaceSymbolProvider
import IReadOnlyModel = monaco.editor.IReadOnlyModel;
import Range = monaco.Range;
import Location = monaco.languages.Location;
import MarkedString = monaco.MarkedString;

import {
	DocumentSelector, DocumentFilter,
	DidOpenTextDocumentParams
} from 'vscode-languageclient';
import {
	TextDocumentItem, MarkedString as LSMarkedString
} from 'vscode-languageserver-types';
import {
	TextDocument,
	TextLine
} from './monaco-text-document';

function toMarkedStringArray(contents: LSMarkedString | LSMarkedString[]): MarkedString[] {
	if (!contents) {
		return void 0;
	}
	if (Array.isArray(contents)) {
		return (<LSMarkedString[]>contents);
	}
	return [<LSMarkedString>contents];
}

/**
 * Creates a new hover object.
 *
 * @param contents The contents of the hover.
 * @param range The range to which the hover applies.
 */
export function MonacoHover(contents: LSMarkedString | LSMarkedString[], range?: Range): Hover {
	let hover: Hover = {
		range,
		contents: toMarkedStringArray(contents)
	};
	return hover;
}

// ”capabilities": {
// 	"textDocumentSync": 1,
// 	"hoverProvider": true,
// 	"definitionProvider": true,
// 	"referencesProvider": true,
// 	"documentSymbolProvider": true,
// 	//"workspaceSymbolProvider": true;
// }

export class MonacoLanguages {
	constructor() {
	}

	private _getLanguageId(selector: DocumentSelector): string {
		const LANGAUGE_ID_DEFAULT: string = 'go';

		let languageId: string;
		if (Array.isArray(selector) && selector.length > 1) {
			languageId = <string>selector[0];
		} else if (typeof selector === 'string') {
			languageId = selector;
		} else {
			languageId = LANGAUGE_ID_DEFAULT;
		}
		return languageId;
	}

	registerHoverProvider(selector: DocumentSelector, provider: HoverProvider): Disposable {
		let languageId = this._getLanguageId(selector);
		return monaco.languages.registerHoverProvider(languageId, {
			provideHover: (model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<Hover> => {
				// let textDocument = new TextDocument(model);

				// adjust positions for vscode-languageclient
				let vscodePosition = position.clone();
				vscodePosition['line'] = position.lineNumber - 1;
				vscodePosition['character'] = position.column - 1;

				return <Thenable<Hover>>provider.provideHover(model, vscodePosition, token);
			}
		});
	}

	registerDefinitionProvider(selector: DocumentSelector, provider: DefinitionProvider): Disposable {
		let languageId = this._getLanguageId(selector);
		return monaco.languages.registerDefinitionProvider(languageId, {
			provideDefinition(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.Definition> {
				const resource = model.uri;
				// adjust positions for vscode-languageclient
				let vscodePosition = position.clone();
				vscodePosition['line'] = position.lineNumber - 1;
				vscodePosition['character'] = position.column - 1;

				return <Thenable<monaco.languages.Definition>>provider.provideDefinition(model, vscodePosition, token);
			}
		});
	}

	registerReferenceProvider(selector: DocumentSelector, provider: ReferenceProvider): Disposable {
		let languageId = this._getLanguageId(selector);
		return monaco.languages.registerReferenceProvider(languageId, {
			provideReferences(model: IReadOnlyModel, position: Position, context: ReferenceContext, token: CancellationToken): Location[] | Thenable<Location[]> {
				const resource = model.uri;
				// adjust positions for vscode-languageclient
				let vscodePosition = position.clone();
				vscodePosition['line'] = position.lineNumber - 1;
				vscodePosition['character'] = position.column - 1;

				return provider.provideReferences(model, vscodePosition, context, token);
			}
		});
	}

	registerDocumentSymbolProvider(selector: DocumentSelector, provider: DocumentSymbolProvider): Disposable {
		let languageId = this._getLanguageId(selector);
		return monaco.languages.registerDocumentSymbolProvider(languageId, provider);
	}

	registerWorkspaceSymbolProvider(provider: any): Disposable {
		return {
			dispose() {
			}
		};
	}

	// see this file:
	// https://github.com/Microsoft/vscode/blob/c67ef57cda90b5f28499646f7cc94e8dcc5b0586/src/vs/editor/common/modes/languageSelector.ts

	match(selector: DocumentSelector, document: TextDocument): number {
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

	private _match(selector: DocumentSelector, document: TextDocument): number {
		if (typeof selector === 'string') {
			let modeId = document.model.getModeId();
			return modeId === selector ? 1 : 0;
		} else {
			return 0;
		}
	}

	createDiagnosticCollection() {
		return {};
	}
}