/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { WorkerManager } from './workerManager';
import { GoWorker } from './goWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';
import { LanguageClient } from; 'vscode-languageclient';
import * as MonacoLanguageClient from './monaco-language-client';

import MonacoPromise = monaco.Promise;
import Uri = monaco.Uri;
import IDisposable = monaco.IDisposable;

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {
	let disposables: IDisposable[] = [];

	let languageClient: LanguageClient = MonacoLanguageClient.create();
	disposables.push(languageClient.start());

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




