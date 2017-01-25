import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import Uri = monaco.Uri;
import Range = monaco.Range;
import IRange = monaco.IRange;
import * as _ from 'lodash';

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
	private static TRACE_DEFAULT = 'messages';

	private _id: string;
	private _storageKeys: string[];
	private _sections: {};

	constructor(id: string = 'langserver-go') {
		this._id = id;
		this._storageKeys = this.makeStorageKeys(id);
		this._sections = this.makeSections();
	}

	private makeStorageKeys(id: string) {
		const STORAGE_KEY_PREFIX = 'monaco.workspace';

		// make storage keys - will remove in near future.
		// just needed for backwards compat.
		return ([
			`.${id}`,
			`.langserver-antha`
		]).map((langserverId) => {
			return `${STORAGE_KEY_PREFIX}.${langserverId}`;
		});
	}

	private makeSections() {
		let trace = MonacoWorkspaceConfig.TRACE_DEFAULT;

		// find first non-null config using the storage keys
		let langserverConfig = this._storageKeys.map((storageKey) => {
			let langserverConfig = localStorage.getItem(storageKey);
			return langserverConfig;
		}).find((langserverConfig) => {
			if (langserverConfig) {
				return true;
			} else {
				return false;
			}
		});

		if (langserverConfig) {
			let langserverConfigJson = JSON.parse(langserverConfig);
			trace = _.get(langserverConfigJson, 'trace.server', MonacoWorkspaceConfig.TRACE_DEFAULT);
		}

		return {
			'trace.server': trace
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
	public static ROOT_PATH: string = '/Users/mbana/go/src/github.com/sourcegraph/go-langserver/langserver';

	private _workspaceConfigs: MonacoWorkspaceConfig[];
	private _textDocuments: TextDocument[] = [];
	private _onDidOpenTextDocument = new Emitter<TextDocument>();
	private _onDidChangeTextDocument = new Emitter<TextDocumentChangeEvent>();
	private _onDidSaveTextDocument = new Emitter<TextDocument>(); // noop
	private _onDidCloseTextDocument = new Emitter<TextDocument>();
	public rootPath: string;

	private constructor(rootPath: string = MonacoWorkspace.ROOT_PATH, workspaceConfigs = [new MonacoWorkspaceConfig()]) {
		this.rootPath = rootPath;
		this._workspaceConfigs = workspaceConfigs;

		monaco.editor.onDidCreateModel(this._onModelAdd.bind(this));
		monaco.editor.onWillDisposeModel(this._onModelRemove.bind(this));
		monaco.editor.getModels().forEach(this._onModelAdd, this);

		// todo
		// this._disposables.push()
	}

	static create(): MonacoWorkspace {
		// const STORAGE_KEY = 'monaco.workspace';

		// let monacoWorkspace = new MonacoWorkspace();

		// let workspaceStr = localStorage.getItem(STORAGE_KEY);
		// if (workspaceStr) {
		// 	try {
		// 		let workspace = JSON.parse(workspaceStr);
		// 		let rootPath = workspace.rootPath ? workspace.rootPath : MonacoWorkspace.ROOT_PATH;

		// 		monacoWorkspace = new MonacoWorkspace(rootPath);
		// 	} catch (err) {
		// 		console.error('MonacoWorkspace.create: ', err);
		// 	}
		// } else {
		// 	let workspace = JSON.stringify({
		// 		rootPath: monacoWorkspace.rootPath
		// 	});
		// 	localStorage.setItem(STORAGE_KEY, workspace);
		// }

		let monacoWorkspace = new MonacoWorkspace(MonacoWorkspace.ROOT_PATH);
		return monacoWorkspace;
	}

	// private static setRootPath(monacoWorkspace: MonacoWorkspace) {
	// 	let workspaceStr = localStorage.getItem(STORAGE_KEY);
	// 	if (workspaceStr) {
	// 		try {
	// 			let workspace = JSON.parse(workspaceStr);
	// 			let rootPath = workspace.rootPath ? workspace.rootPath : MonacoWorkspace.ROOT_PATH;

	// 			monacoWorkspace = new MonacoWorkspace(rootPath);
	// 		} catch (err) {
	// 			console.error('MonacoWorkspace.create: ', err);
	// 		}
	// 	} else {
	// 		let workspace = JSON.stringify({
	// 			rootPath: monacoWorkspace.rootPath
	// 		});
	// 		localStorage.setItem(STORAGE_KEY, workspace);
	// 	}
	// }

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