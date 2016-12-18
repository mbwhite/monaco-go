import Uri = monaco.Uri;
import Range = monaco.Range;
import Severity = monaco.Severity;
import {
	TextDocumentItem, MarkedString as LSMarkedString,
	Definition, Location, Diagnostic
} from 'vscode-languageserver-types';
import * as _ from 'lodash';

export { Severity as MonacoDiagnosticSeverity };

/**
 * Represents a diagnostic, such as a compiler error or warning. Diagnostic objects
 * are only valid in the scope of a file.
 */
export class MonacoDiagnostic {
	/**
	 * The range to which this diagnostic applies.
	 */
	public range: Range;

	/**
	 * The human-readable message.
	 */
	public message: string;

	/**
	 * A human-readable string describing the source of this
	 * diagnostic, e.g. 'typescript' or 'super lint'.
	 */
	public source: string;

	/**
	 * The severity, default is [error](#DiagnosticSeverity.Error).
	 */
	public severity: Severity;

	/**
	 * A code or identifier for this diagnostics. Will not be surfaced
	 * to the user, but should be used for later processing, e.g. when
	 * providing [code actions](#CodeActionContext).
	 */
	public code: string | number;

	/**
	 * Creates a new diagnostic object.
	 *
	 * @param range The range to which this diagnostic applies.
	 * @param message The human-readable message.
	 * @param severity The severity, default is [error](#DiagnosticSeverity.Error).
	 */
	constructor(range: Range, message: string, severity?: Severity) {
		this.range = range;
		this.message = message;
		this.severity = Severity.Error;
	}
}

// from vscode-languageclient
//
// private handleDiagnostics(params: PublishDiagnosticsParams) {
// 	let uri = this._p2c.asUri(params.uri);
// 	let diagnostics = this._p2c.asDiagnostics(params.diagnostics);
// 	this._diagnostics!.set(uri, diagnostics);
// }

/**
 * A diagnostics collection is a container that manages a set of
 * [diagnostics](#Diagnostic). Diagnostics are always scopes to a
 * diagnostics collection and a resource.
 *
 * To get an instance of a `DiagnosticCollection` use
 * [createDiagnosticCollection](#languages.createDiagnosticCollection).
 */
export class MonacoDiagnosticCollection {
	private _store: {
		[key: string]: Diagnostic[];
	};

	/**
	 * The name of this diagnostic collection, for instance `typescript`. Every diagnostic
	 * from this collection will be associated with this name. Also, the task framework uses this
	 * name when defining [problem matchers](https://code.visualstudio.com/docs/editor/tasks#_defining-a-problem-matcher).
	 * @readonly
	 */
	public readonly name: string;

	constructor(name: string = 'langserver-go-diagnostic-collection') {
		this.name = name;
		this._store = {};
	}

	/**
	 * Assign diagnostics for given resource. Will replace
	 * existing diagnostics for that resource.
	 *
	 * @param uri A resource identifier.
	 * @param diagnostics Array of diagnostics or `undefined`
	 */
	set(uri: Uri, diagnostics: Diagnostic[] | undefined): void {
		console.log('MonacoDiagnosticCollection: ', uri, diagnostics);

		let key = uri.toString();
		if (_.has(this._store, key)) {
			// log overwrite
		}
		this._store[key] = diagnostics;

		//  todo: set the model marks in the monaco.editor
		this.setModelMarkers(uri, diagnostics);
	}

	// /**
	//  * Replace all entries in this collection.
	//  *
	//  * Diagnostics of multiple tuples of the same uri will be merged, e.g
	//  * `[[file1, [d1]], [file1, [d2]]]` is equivalent to `[[file1, [d1, d2]]]`.
	//  * If a diagnostics item is `undefined` as in `[file1, undefined]`
	//  * all previous but not subsequent diagnostics are removed.
	//  *
	//  * @param entries An array of tuples, like `[[file1, [d1, d2]], [file2, [d3, d4, d5]]]`, or `undefined`.
	//  */
	// set(entries: [Uri, Diagnostic[] | undefined][]): void {

	// }

	/**
	 * Remove all diagnostics from this collection that belong
	 * to the provided `uri`. The same as `#set(uri, undefined)`.
	 *
	 * @param uri A resource identifier.
	 */
	delete(uri: Uri): void {
		let key = uri.toString();
		delete this._store[key];
	}

	/**
	 * Remove all diagnostics from this collection. The same
	 * as calling `#set(undefined)`;
	 */
	clear(): void {
		this._store = {};
	}

	/**
	 * Iterate over each entry in this collection.
	 *
	 * @param callback Function to execute for each entry.
	 * @param thisArg The `this` context used when invoking the handler function.
	 */
	forEach(callback: (uri: Uri, diagnostics: Diagnostic[], collection: MonacoDiagnosticCollection) => any, thisArg?: any): void {
		// Array.of(this._store).forEach((entry) => {
		// 	let uri = entry[0];
		// 	let diagnosticsEntries = entry[0];
		// });
		_.forEach(this._store, (diagnostics: Diagnostic[], key: string) => {
			let uri = Uri.parse(key);
			let collection: MonacoDiagnosticCollection;

			if (thisArg) {
				callback(uri, diagnostics, collection).bind(thisArg);
			} else {
				callback(uri, diagnostics, collection);
			}
		});
	}

	/**
	 * Get the diagnostics for a given resource. *Note* that you cannot
	 * modify the diagnostics-array returned from this call.
	 *
	 * @param uri A resource identifier.
	 * @returns An immutable array of [diagnostics](#Diagnostic) or `undefined`.
	 */
	get(uri: Uri): Diagnostic[] | undefined {
		let key = uri.toString();
		return this._store[key];
	}

	/**
	 * Check if this collection contains diagnostics for a
	 * given resource.
	 *
	 * @param uri A resource identifier.
	 * @returns `true` if this collection has diagnostic for the given resource.
	 */
	has(uri: Uri): boolean {
		let key = uri.toString();
		let diagnostics = this._store[key];
		if (diagnostics) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Dispose and free associated resources. Calls
	 * [clear](#DiagnosticCollection.clear).
	 */
	dispose(): void {
		// todo
	}

	private setModelMarkers(uri: Uri, diagnostics: Diagnostic[]) {
		let model = monaco.editor.getModel(uri);
		if (!model) {
			let models = monaco.editor.getModels();
			console.log('setModelMarkers - uri: ', uri.toString());
			console.log('setModelMarkers - uri: ', uri);
			console.log('setModelMarkers - diagnostics: ', diagnostics);
			console.log('setModelMarkers - models: ', models);
			return;
		}

		let languageId = 'go';
		let markers = diagnostics.map((diagnostic) => {
			return this.toDiagnostics(uri, diagnostic);
		});
		monaco.editor.setModelMarkers(model, languageId, markers);
	}

	private toDiagnostics(uri: Uri, diag: Diagnostic): monaco.editor.IMarkerData {
		if (!uri) {
			return;
		}

		let code = typeof diag.code === 'number' ? String(diag.code) : <string>diag.code;
		let range: Range = <any>diag.range;

		return {
			severity: diag.severity,
			startLineNumber: range.startLineNumber,
			startColumn: range.startColumn,
			endLineNumber: range.endLineNumber,
			endColumn: range.endColumn,
			message: diag.message,
			code: code,
			source: diag.source
		};

		// return {
		// 	severity: toSeverity(diag.severity),
		// 	startLineNumber: diag.range.start.line + 1,
		// 	startColumn: diag.range.start.character + 1,
		// 	endLineNumber: diag.range.end.line + 1,
		// 	endColumn: diag.range.end.character + 1,
		// 	message: diag.message,
		// 	code: code,
		// 	source: diag.source
		// };
	}
}
