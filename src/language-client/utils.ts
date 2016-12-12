export class Utils {
	private constructor() {
	}

	public static byteLength(input: string, encoding: string = 'utf-8') {
		// new TextEncoder('utf-8').encode('foo')).length
		let encoder = new TextEncoder(encoding).encode(input);
		let len = encoder.length;

		return len;
	}
}