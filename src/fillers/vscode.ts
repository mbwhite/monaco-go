import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import Uri = monaco.Uri;

import {
	DocumentSelector, DocumentFilter,
	DidOpenTextDocumentParams
} from 'vscode-languageclient';

import {
	TextDocumentItem
} from 'vscode-languageserver-types';


import { MonacoWindow } from './vscode/monaco-window';
import { MonacoLanguages } from './vscode/monaco-languages';
import { MonacoWorkspace } from './vscode/monaco-workspace';
import { TextDocument, TextLine } from './vscode/monaco-text-document';
import { MonacoOutputChannel } from './vscode/monaco-output-channel';

export { MonacoWindow };
export { MonacoLanguages };
export { MonacoWorkspace };
export { TextDocument, TextLine };
export { MonacoOutputChannel };

export function CompletionItem() { };

export function CodeLens() { };

export function Disposable() { };

export const workspace = new MonacoWorkspace();

export const window = new MonacoWindow();

export const languages = new MonacoLanguages();