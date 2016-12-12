import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import Uri = monaco.Uri;
import Disposable = monaco.IDisposable;
import Position = monaco.Position;
import Range = monaco.Range;
import Location = monaco.languages.Location;
import CancellationToken = monaco.CancellationToken;

import Thenable = monaco.Thenable;
import Definition = monaco.languages.Definition;
import Hover = monaco.languages.Hover;
import HoverProvider = monaco.languages.HoverProvider;
import DefinitionProvider = monaco.languages.DefinitionProvider;
import ReferenceProvider = monaco.languages.ReferenceProvider;
import DocumentSymbolProvider = monaco.languages.DocumentSymbolProvider;

/**
 * @param line A zero-based line value.
 * @param character A zero-based character value.
 */
export function MonacoPosition(line: number, character: number): Position {
	let lineNumber = line + 1;
	let column = character + 1;

	return new Position(lineNumber, column);
}

/**
 * Create a new range from two positions. If `start` is not
 * before or equal to `end`, the values will be swapped.
 *
 * @param start A position.
 * @param end A position.
 */
export function MonacoRange(start: Position, end: Position): Range {
	return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
}


/**
 * Creates a new location object.
 *
 * @param uri The resource identifier.
 * @param rangeOrPosition The range or position. Positions will be converted to an empty range.
 */
export function MonacoLocation(uri: Uri, range: Range): Location {
	let location: Location  = {
		uri,
		range
	};
	return location;
}