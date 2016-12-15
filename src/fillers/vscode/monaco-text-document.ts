import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import Uri = monaco.Uri;
import Range = monaco.Range;
import Position = monaco.Position;
import IPosition = monaco.IPosition;

import {
	DocumentSelector, DocumentFilter,
	DidOpenTextDocumentParams
} from 'vscode-languageclient';
import {
	TextDocumentItem
} from 'vscode-languageserver-types';

// todo: need to implemennt the rest of these CanvasPathMethods. see this file,
// http://127.0.0.1:8080/node_modules/vscode-languageclient/src/codeConverter.ts.
//
// textDocument: TextDocumentItem
//
// 	function asOpenTextDocumentParams(textDocument: code.TextDocument): proto.DidOpenTextDocumentParams {
// 		return {
// 			textDocument: {
// 				uri: _uriConverter(textDocument.uri),
// 				languageId: textDocument.languageId,
// 				version: textDocument.version,
// 				text: textDocument.getText()
// 			}
// 		};
// 	}
//
// see:
// https://code.visualstudio.com/docs/extensionAPI/vscode-api#TextDocument


/**
 * Represents a line of text, such as a line of source code.
 *
 * TextLine objects are __immutable__. When a [document](#TextDocument) changes,
 * previously retrieved lines will not represent the latest state.
 */
export interface TextLine {

	/**
	 * The zero-based line number.
	 *
	 * @readonly
	 */
	lineNumber: number;

	/**
	 * The text of this line without the line separator characters.
	 *
	 * @readonly
	 */
	text: string;

	/**
	 * The range this line covers without the line separator characters.
	 *
	 * @readonly
	 */
	range: Range;

	/**
	 * The range this line covers with the line separator characters.
	 *
	 * @readonly
	 */
	rangeIncludingLineBreak: Range;

	/**
	 * The offset of the first character which is not a whitespace character as defined
	 * by `/\s/`. **Note** that if a line is all whitespaces the length of the line is returned.
	 *
	 * @readonly
	 */
	firstNonWhitespaceCharacterIndex: number;

	/**
	 * Whether this line is whitespace only, shorthand
	 * for [TextLine.firstNonWhitespaceCharacterIndex](#TextLine.firstNonWhitespaceCharacterIndex) === [TextLine.text.length](#TextLine.text).
	 *
	 * @readonly
	 */
	isEmptyOrWhitespace: boolean;
}

export class TextDocument {
	public model: monaco.editor.IModel;

	constructor(model: monaco.editor.IModel) {
		this.model = model;
	}

	/**
	 * The associated URI for this document. Most documents have the __file__-scheme, indicating that they
	 * represent files on disk. However, some documents may have other schemes indicating that they are not
	 * available on disk.
	 *
	 * @readonly
	 */
	get uri(): Uri {
		return this.model.uri;
	}

	/**
	 * The file system path of the associated resource. Shorthand
	 * notation for [TextDocument.uri.fsPath](#TextDocument.uri). Independent of the uri scheme.
	 *
	 * @readonly
	 */
	get fileName(): string {
		return this.model.id;
	}

	/**
	 * Is this document representing an untitled file.
	 *
	 * @readonly
	 */
	get isUntitled(): boolean {
		// return false for now
		return false;
	}

	/**
	 * The identifier of the language associated with this document.
	 *
	 * @readonly
	 */
	get languageId(): string {
		return this.model.getModeId();
	}

	/**
	 * The version number of this document (it will strictly increase after each
	 * change, including undo/redo).
	 *
	 * @readonly
	 */
	get version(): number {
		let versionId = this.model.getVersionId();
		return versionId;
	}

	/**
	 * true if there are unpersisted changes.
	 *
	 * @readonly
	 */
	get isDirty(): boolean {
		// return true for now.
		return true;
	}

	/**
	 * Save the underlying file.
	 *
	 * @return A promise that will resolve to true when the file
	 * has been saved. If the file was not dirty or the save failed,
	 * will return false.
	 */
	save(): Thenable<boolean> {
		return Promise.resolve(true);
	}

	/**
	 * The number of lines in this document.
	 *
	 * @readonly
	 */
	get lineCount(): number {
		return this.model.getLineCount();
	}

	/**
	 * Returns a text line denoted by the line number. Note
	 * that the returned object is *not* live and changes to the
	 * document are not reflected.
	 *
	 * @param line A line number in [0, lineCount).
	 * @param position A position.
	 * @return A [line](#TextLine).
	 */
	lineAt(lineNumber: number): TextLine {
		let line = lineNumber + 1;
		let model = this.model;

		let text = model.getLineContent(lineNumber);
		let range;
		let rangeIncludingLineBreak;
		let firstNonWhitespaceCharacterIndex;
		let isEmptyOrWhitespace;

		// let minCol = model.getLineMinColumn(lineNumber);
		// let maxCol = model.getLineMaxColumn(lineNumber);
		// let maxCol = model.getLineFirstNonWhitespaceColumn(lineNumber);
		// let maxCol = model.getLineLastNonWhitespaceColumn(lineNumber);

		let textLine: TextLine = {
			lineNumber,
			text,
			range,
			rangeIncludingLineBreak,
			firstNonWhitespaceCharacterIndex,
			isEmptyOrWhitespace,
		};
		return textLine;
	}

	// /**
	//  * Returns a text line denoted by the position. Note
	//  * that the returned object is *not* live and changes to the
	//  * document are not reflected.
	//  *
	//  * The position will be [adjusted](#TextDocument.validatePosition).
	//  *
	//  * @see [TextDocument.lineAt](#TextDocument.lineAt)
	//  * @param position A position.
	//  * @return A [line](#TextLine).
	//  */
	// lineAt(position: Position): TextLine;

	/**
	 * Converts the position to a zero-based offset.
	 *
	 * The position will be [adjusted](#TextDocument.validatePosition).
	 *
	 * @param position A position.
	 * @return A valid zero-based offset.
	 */
	offsetAt(position: Position): number {
		return 0;
	}

	/**
	 * Converts a zero-based offset to a position.
	 *
	 * @param offset A zero-based offset.
	 * @return A valid [position](#Position).
	 */
	positionAt(offset: number): Position {
		return null;
	}

	/**
	 * Get the text of this document. A substring can be retrieved by providing
	 * a range. The range will be [adjusted](#TextDocument.validateRange).
	 *
	 * @param range Include only the text included by the range.
	 * @return The text inside the provided range or the entire text.
	 */
	getText(range?: Range): string {
		let model = this.model;
		let value = model.getValue();
		let rawText = model.toRawText();

		return value;
	}

	/**
	 * Get a word-range at the given position. By default words are defined by
	 * common separators, like space, -, _, etc. In addition, per languge custom
	 * [word definitions](#LanguageConfiguration.wordPattern) can be defined. It
	 * is also possible to provide a custom regular expression.
	 *
	 * The position will be [adjusted](#TextDocument.validatePosition).
	 *
	 * @param position A position.
	 * @param regex Optional regular expression that describes what a word is.
	 * @return A range spanning a word, or `undefined`.
	 */
	getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined {
		return null;
	}

	/**
	 * Ensure a range is completely contained in this document.
	 *
	 * @param range A range.
	 * @return The given range or a new, adjusted range.
	 */
	validateRange(range: Range): Range {
		return null;
	}

	/**
	 * Ensure a position is contained in the range of this document.
	 *
	 * @param position A position.
	 * @return The given position or a new, adjusted position.
	 */
	validatePosition(position: Position): Position {
		return null;
	}
}

/**
 * An event describing an individual change in the text of a [document](#TextDocument).
 */
export interface TextDocumentContentChangeEvent {
	/**
	 * The range that got replaced.
	 */
	range: Range;
	/**
	 * The length of the range that got replaced.
	 */
	rangeLength: number;
	/**
	 * The new text for the range.
	 */
	text: string;
}

/**
 * An event describing a transactional [document](#TextDocument) change.
 */
export interface TextDocumentChangeEvent {

	/**
	 * The affected document.
	 */
	document: TextDocument;

	/**
	 * An array of content changes.
	 */
	contentChanges: TextDocumentContentChangeEvent[];
}
