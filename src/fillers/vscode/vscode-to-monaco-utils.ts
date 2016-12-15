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

export class VSCodeToMonacoUtils {
	private constructor() {
	}

	static toMonacoLine(lineNumber: number): number {
		return 0;
	}
}
