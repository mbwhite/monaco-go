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

import {
	TextDocument,
	TextLine
} from './monaco-text-document';

export class MonacoLanguages {
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

	private _match(selector: DocumentSelector, document: TextDocument) {
		if (typeof selector === 'string') {
			let modeId = document.model.getModeId();
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
	createDiagnosticCollection() {
		return {};
	}
}