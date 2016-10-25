/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { WorkerManager } from './workerManager';
import { GoWorker } from './goWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';
import { GoLanguageClient } from './goLanguageClient';

import Promise = monaco.Promise;
import Uri = monaco.Uri;
import IDisposable = monaco.IDisposable;

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {
    let languageClient: GoLanguageClient = new GoLanguageClient();
    let disposables: IDisposable[] = [];

    const client = new WorkerManager(defaults);
    disposables.push(client);

    const worker = (first: Uri, ...more: Uri[]): Promise<GoWorker> => {
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




