/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { WorkerManager } from './workerManager';
import { GoWorker } from './goWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';
import * as lc from 'vscode-languageclient';

import MonacoPromise = monaco.Promise;
import Uri = monaco.Uri;
import IDisposable = monaco.IDisposable;


function createWebSocket() {
	let streamInfo: lc.StreamInfo = {
		// writer: NodeJS.WritableStream;
		// reader: NodeJS.ReadableStream;
		writer: null,
		reader: null,
	};

	return streamInfo;
}

function createLanguageClient(): lc.LanguageClient {
	let serverOptions: () => Thenable<lc.StreamInfo> = () => {
		return Promise.resolve(createWebSocket());
	};
	let clientOptions: lc.LanguageClientOptions = {
	};
	let forceDebug: boolean = false;

	let client = new lc.LanguageClient('langserver-antha', serverOptions, clientOptions, forceDebug);
	return client;
}

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {
	let languageClient: lc.LanguageClient = createLanguageClient();
	languageClient.start();


	let disposables: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	disposables.push(client);

	const worker = (first: Uri, ...more: Uri[]): MonacoPromise<GoWorker> => {
		return client.getLanguageServiceWorker(...[first].concat(more));
	};

	let languageId = defaults.languageId;

	disposables.push(monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker)));
	disposables.push(monaco.languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker)));
	disposables.push(monaco.languages.registerDocumentHighlightProvider(languageId, new languageFeatures.DocumentHighlightAdapter(worker)));
	disposables.push(monaco.languages.registerDefinitionProvider(languageId, new languageFeatures.DefinitionAdapter(worker)));
	disposables.push(monaco.languages.registerReferenceProvider(languageId, new languageFeatures.ReferenceAdapter(worker)));
	disposables.push(monaco.languages.registerDocumentSymbolProvider(languageId, new languageFeatures.DocumentSymbolAdapter(worker)));
	disposables.push(monaco.languages.registerRenameProvider(languageId, new languageFeatures.RenameAdapter(worker)));
	disposables.push(new languageFeatures.DiagnostcsAdapter(languageId, worker));
}




