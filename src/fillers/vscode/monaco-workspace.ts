import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import Uri = monaco.Uri;
import Range = monaco.Range;
import IRange = monaco.IRange;

import {
	DocumentSelector, DocumentFilter,
	DidOpenTextDocumentParams,
} from 'vscode-languageclient';

import {
	TextDocumentItem,
} from 'vscode-languageserver-types';

import {
	TextDocument, TextLine,
	TextDocumentContentChangeEvent, TextDocumentChangeEvent,
} from './monaco-text-document';

import * as vscodeToMonaco from './vscode-to-monaco-utils';

export class MonacoWorkspaceConfig {
	private _id: string = 'langserver-antha';
	private _sections: {};

	constructor(id: string = 'langserver-antha') {
		this._id = id;
		this._sections = {
			'trace.server': 'messages'
		};
	}

	get id() {
		return this._id;
	}

	get(section, defaultValue) {
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

export class MonacoWorkspace {
	public static ROOT_PATH: string = '/Users/mbana/go/src/github.com/sourcegraph/go-langserver';

	private _workspaceConfigs: MonacoWorkspaceConfig[];
	private _textDocuments: TextDocument[] = [];
	private _onDidOpenTextDocument = new Emitter<TextDocument>();
	private _onDidChangeTextDocument = new Emitter<TextDocumentChangeEvent>();
	private _onDidSaveTextDocument = new Emitter<TextDocument>(); // noop
	private _onDidCloseTextDocument = new Emitter<TextDocument>();
	public rootPath: string;

	constructor(rootPath = MonacoWorkspace.ROOT_PATH, workspaceConfigs = [new MonacoWorkspaceConfig()]) {
		this.rootPath = rootPath;
		this._workspaceConfigs = workspaceConfigs;

		monaco.editor.onDidCreateModel(this._onModelAdd);
		monaco.editor.onWillDisposeModel(this._onModelRemove);
		monaco.editor.getModels().forEach(this._onModelAdd, this);

		// this._disposables.push()
	}

	get onDidOpenTextDocument(): IEvent<TextDocument> {
		return this._onDidOpenTextDocument.event;
	}

	get onDidChangeTextDocument(): IEvent<TextDocumentChangeEvent> {
		return this._onDidChangeTextDocument.event;
	}

	get onDidSaveTextDocument(): IEvent<TextDocument> {
		return this._onDidSaveTextDocument.event;
	}

	get onDidCloseTextDocument(): IEvent<TextDocument> {
		return this._onDidCloseTextDocument.event;
	}

	private _onModelAdd(model: monaco.editor.IModel): void {
		let textDocument = new TextDocument(model);

		this._textDocuments.push(textDocument);
		this._onDidOpenTextDocument.fire(textDocument);

		model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent2) => {
			let textDocumentChangeEvent = this._toTextDocumentContentChangeEvent(e);

			let document = textDocument;
			let contentChanges: TextDocumentContentChangeEvent[] = [
				textDocumentChangeEvent
			];

			let event: TextDocumentChangeEvent = {
				document,
				contentChanges,
			};
			this._onDidChangeTextDocument.fire(event);
		});
	}

	private _onModelRemove(model: monaco.editor.IModel): void {
		let textDocument = new TextDocument(model);
		this._onDidCloseTextDocument.fire(textDocument);
	}

	get textDocuments() {
		return this._textDocuments;
	}

	getConfiguration(id: string): MonacoWorkspaceConfig | undefined {
		return this._workspaceConfigs.find((config: MonacoWorkspaceConfig) => {
			return config.id === id;
		});
	}

	private _toTextDocumentContentChangeEvent(e: monaco.editor.IModelContentChangedEvent2): TextDocumentContentChangeEvent {
		let range = Range.lift(e.range);
		let rangeLength = e.rangeLength;
		let text = e.text;

		return {
			range,
			rangeLength,
			text,
		};
	}
}