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
import SymbolKind = monaco.languages.SymbolKind;
import SymbolInformation = monaco.languages.SymbolInformation;

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
	// return new Range(
	// 	start.lineNumber + 1,
	// 	start.column + 1,
	// 	end.lineNumber + 1,
	// 	end.column + 1
	// );
	return new Range(
		start.lineNumber,
		start.column,
		end.lineNumber,
		end.column
	);
}

/**
 * Creates a new location object.
 *
 * @param uri The resource identifier.
 * @param rangeOrPosition The range or position. Positions will be converted to an empty range.
 */
export function MonacoLocation(uri: Uri, range: Range): Location {
	let location: Location = {
		uri,
		range
	};
	return location;
}

/**
 * @deprecated Please use the constructor taking a [location](#Location) object.
 *
 * Creates a new symbol information object.
 *
 * @param name The name of the symbol.
 * @param kind The kind of the symbol.
 * @param range The range of the location of the symbol.
 * @param uri The resource of the location of symbol, defaults to the current document.
 * @param containerName The name of the symbol containing the symbol.
 */
export function MonacoSymbolInformation(name: string, kind: SymbolKind, range: Range, uri?: Uri, containerName?: string): SymbolInformation {
	let location: Location = {
		uri,
		range,
	};

	return {
		name,
		containerName,
		kind,
		location,
	};
}