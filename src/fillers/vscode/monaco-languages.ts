import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import Uri = monaco.Uri;
import Disposable = monaco.IDisposable;
import Position = monaco.Position;
import CancellationToken = monaco.CancellationToken;
import Thenable = monaco.Thenable;
import Hover = monaco.languages.Hover;
import HoverProvider = monaco.languages.HoverProvider;
import DefinitionProvider = monaco.languages.DefinitionProvider;
import ReferenceProvider = monaco.languages.ReferenceProvider;
import ReferenceContext = monaco.languages.ReferenceContext;
import DocumentSymbolProvider = monaco.languages.DocumentSymbolProvider;
// import WorkspaceSymbolProvider = monaco.languages.WorkspaceSymbolProvider
import MLocation = monaco.languages.Location;
import IReadOnlyModel = monaco.editor.IReadOnlyModel;
import Range = monaco.Range;
import MarkedString = monaco.MarkedString;

import {
	DocumentSelector, DocumentFilter,
	DidOpenTextDocumentParams
} from 'vscode-languageclient';
import {
	TextDocumentItem, MarkedString as LSMarkedString,
	Definition, Location,
} from 'vscode-languageserver-types';
import {
	TextDocument,
	TextLine
} from './monaco-text-document';
import {
	MonacoDiagnostic, MonacoDiagnosticCollection
} from './monaco-diagnostic';

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

// add definition for fetch api
interface Window {
	fetch(url: string, init?: RequestInit): Promise<any>;
}

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
				console.log('this: ', this);
				// let textDocument = new TextDocument(model);
				let vscodePosition = MonacoLanguages.toVSCodePosition(position);

				return <Thenable<Hover>>provider.provideHover(model, vscodePosition, token);
			}
		});
	}

	registerDefinitionProvider(selector: DocumentSelector, provider: DefinitionProvider): Disposable {
		let languageId = this._getLanguageId(selector);
		return monaco.languages.registerDefinitionProvider(languageId, {
			provideDefinition(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.Definition> {
				let vscodePosition = MonacoLanguages.toVSCodePosition(position);

				// hack: create models - otherwise you can't jump to the definition
				let definition = <Thenable<monaco.languages.Definition>>provider.provideDefinition(model, vscodePosition, token);
				return definition.then((definition) => {
					if (definition instanceof Array) {
						return Promise.all(definition.map((location) => {
							return MonacoLanguages.tryLoadModel(location.uri).then((model) => {
								window['langserverEditor'].setModel(model);
								MonacoLanguages.updateFileContainer(location.uri);

								return location;
							});
						})).then((locations) => {
							return locations;
						});
					} else {
						return MonacoLanguages.tryLoadModel(definition.uri).then((model) => {
							return definition;
						});
					}
				});
			}
		});
	}

	registerReferenceProvider(selector: DocumentSelector, provider: ReferenceProvider): Disposable {
		let languageId = this._getLanguageId(selector);
		return monaco.languages.registerReferenceProvider(languageId, {
			provideReferences(model: IReadOnlyModel, position: Position, context: ReferenceContext, token: CancellationToken): Thenable<MLocation[]> {
				let vscodePosition = MonacoLanguages.toVSCodePosition(position);

				// hack: create models - otherwise you can't jump to the definition
				let references = <Thenable<MLocation[]>>provider.provideReferences(model, vscodePosition, context, token);
				return references.then((references) => {
					if (references instanceof Array) {
						return Promise.all(references.map((location) => {
							return MonacoLanguages.tryLoadModel(location.uri).then((model) => {
								return location;
							});
						})).then((locations) => {
							return locations;
						});
					} else {
						let location = <MLocation>references;
						return MonacoLanguages.tryLoadModel(location.uri).then((model) => {
							return references;
						});
					}
				});
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

	createDiagnosticCollection() {
		return new MonacoDiagnosticCollection();
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

	// adjust positions for vscode-languageclient
	static toVSCodePosition(monacoPos: any) {
		let codePos = monacoPos.clone();
		codePos['line'] = monacoPos.lineNumber - 1;
		codePos['character'] = monacoPos.column - 1;
		return codePos;
	}

	private _match(selector: DocumentSelector, document: TextDocument): number {
		if (typeof selector === 'string') {
			let modeId = document.model.getModeId();
			return modeId === selector ? 1 : 0;
		} else {
			return 0;
		}
	}

	static tryLoadModel(uri: Uri): Promise<monaco.editor.IModel> {
		let doFindModel = () => {
			return MonacoLanguages.findModel(uri);
		};

		let model = doFindModel();
		if (model) {
			return Promise.resolve(model);
		}

		return MonacoLanguages.fetchFile(uri).then((value) => {
			let model = doFindModel();
			if (!model) {
				let language = 'go';
				model = monaco.editor.createModel(value, language, uri);
			}
			return model;
		});
	}

	static findModel(uri: Uri): monaco.editor.IModel {
		let models = monaco.editor.getModels();
		if (!models || !models.length) {
			return null;
		}

		return models.find((model) => {
			return model.uri.toString() === uri.toString();
		});
	}

	static fetchFile(uri: Uri): Promise<string> {
		// "http:/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver/handler.go"
		let filePath = uri.toString();

		let prefix = '/Users/mbana';
		let fileUrl = filePath.includes(prefix) ? filePath.replace(prefix, '') : filePath;

		return window.fetch(fileUrl).then((fetchedFile) => {
			return fetchedFile.text();
		});
	}

	static updateFileContainer(uri: Uri) {
		let filePath = uri.toString();
		let prefix = 'http:';
		let fullFileUri = filePath.includes(prefix) ? filePath.replace(prefix, '') : filePath;

		let elFileUri = document.getElementById('file_uri');
		elFileUri.innerHTML = fullFileUri;
	}
}

// provideDefinition:
//
// {
// 	"result": [
// 		{
// 			"uri": {
// 				"scheme": "http",
// 				"authority": "localhost:8080",
// 				"path": "/go/src/github.com/sourcegraph/go-langserver/langserver/handler.go",
// 				"fsPath": "/go/src/github.com/sourcegraph/go-langserver/langserver/handler.go",
// 				"query": "",
// 				"fragment": "",
// 				"external": "http://localhost:8080/go/src/github.com/sourcegraph/go-langserver/langserver/handler.go",
// 				"$mid": 1
// 			},
// 			"range": {
// 				"startLineNumber": 33,
// 				"startColumn": 8,
// 				"endLineNumber": 33,
// 				"endColumn": 24
// 			}
// 		},
// 		{
// 			"uri": {
// 				"scheme": "http",
// 				"authority": "localhost:8080",
// 				"path": "/go/src/github.com/sourcegraph/go-langserver/langserver/handler.go",
// 				"fsPath": "/go/src/github.com/sourcegraph/go-langserver/langserver/handler.go",
// 				"query": "",
// 				"fragment": "",
// 				"external": "http://localhost:8080/go/src/github.com/sourcegraph/go-langserver/langserver/handler.go",
// 				"$mid": 1
// 			},
// 			"range": {
// 				"startLineNumber": 45,
// 				"startColumn": 35,
// 				"endLineNumber": 45,
// 				"endColumn": 51
// 			}
// 		},
// 		{
// 			"uri": {
// 				"scheme": "http",
// 				"authority": "localhost:8080",
// 				"path": "/go/src/github.com/sourcegraph/go-langserver/langserver/handler.go",
// 				"fsPath": "/go/src/github.com/sourcegraph/go-langserver/langserver/handler.go",
// 				"query": "",
// 				"fragment": "",
// 				"external": "http://localhost:8080/go/src/github.com/sourcegraph/go-langserver/langserver/handler.go",
// 				"$mid": 1
// 			},
// 			"range": {
// 				"startLineNumber": 153,
// 				"startColumn": 14,
// 				"endLineNumber": 153,
// 				"endColumn": 30
// 			}
// 		},
// 		{
// 			"uri": {
// 				"scheme": "http",
// 				"authority": "localhost:8080",
// 				"path": "/go/src/github.com/sourcegraph/go-langserver/langserver/langserver_test.go",
// 				"fsPath": "/go/src/github.com/sourcegraph/go-langserver/langserver/langserver_test.go",
// 				"query": "",
// 				"fragment": "",
// 				"external": "http://localhost:8080/go/src/github.com/sourcegraph/go-langserver/langserver/langserver_test.go",
// 				"$mid": 1
// 			},
// 			"range": {
// 				"startLineNumber": 559,
// 				"startColumn": 43,
// 				"endLineNumber": 559,
// 				"endColumn": 59
// 			}
// 		},
// 		{
// 			"uri": {
// 				"scheme": "http",
// 				"authority": "localhost:8080",
// 				"path": "/go/src/github.com/sourcegraph/go-langserver/langserver/loader_test.go",
// 				"fsPath": "/go/src/github.com/sourcegraph/go-langserver/langserver/loader_test.go",
// 				"query": "",
// 				"fragment": "",
// 				"external": "http://localhost:8080/go/src/github.com/sourcegraph/go-langserver/langserver/loader_test.go",
// 				"$mid": 1
// 			},
// 			"range": {
// 				"startLineNumber": 69,
// 				"startColumn": 21,
// 				"endLineNumber": 69,
// 				"endColumn": 37
// 			}
// 		},
// 		{
// 			"uri": {
// 				"scheme": "http",
// 				"authority": "localhost:8080",
// 				"path": "/go/src/github.com/sourcegraph/go-langserver/langserver/lspx.go",
// 				"fsPath": "/go/src/github.com/sourcegraph/go-langserver/langserver/lspx.go",
// 				"query": "",
// 				"fragment": "",
// 				"external": "http://localhost:8080/go/src/github.com/sourcegraph/go-langserver/langserver/lspx.go",
// 				"$mid": 1
// 			},
// 			"range": {
// 				"startLineNumber": 11,
// 				"startColumn": 6,
// 				"endLineNumber": 11,
// 				"endColumn": 22
// 			}
// 		}
// 	]
// }