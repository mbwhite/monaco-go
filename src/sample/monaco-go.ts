import Emitter = monaco.Emitter;
import IEditorConstructionOptions = monaco.editor.IEditorConstructionOptions;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

// declarations for the fetch api
// and requirejs
declare class Request {
	constructor(input: string | Request, init?: RequestInit);
	method: string;
	url: string;
	headers: Headers;
	context: RequestContext;
	referrer: string;
	mode: RequestMode;
	credentials: RequestCredentials;
	cache: RequestCache;
}

interface RequestInit {
	method?: string;
	headers?: HeaderInit | { [index: string]: string };
	body?: BodyInit;
	mode?: RequestMode;
	credentials?: RequestCredentials;
	cache?: RequestCache;
}

declare enum RequestContext {
	'audio', 'beacon', 'cspreport', 'download', 'embed', 'eventsource', 'favicon', 'fetch',
	'font', 'form', 'frame', 'hyperlink', 'iframe', 'image', 'imageset', 'import',
	'internal', 'location', 'manifest', 'object', 'ping', 'plugin', 'prefetch', 'script',
	'serviceworker', 'sharedworker', 'subresource', 'style', 'track', 'video', 'worker',
	'xmlhttprequest', 'xslt'
}
declare enum RequestMode { 'same-origin', 'no-cors', 'cors' }
declare enum RequestCredentials { 'omit', 'same-origin', 'include' }
declare enum RequestCache { 'default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached' }

declare class Headers {
	append(name: string, value: string): void;
	delete(name: string): void;
	get(name: string): string;
	getAll(name: string): Array<string>;
	has(name: string): boolean;
	set(name: string, value: string): void;
}

declare class Body {
	bodyUsed: boolean;
	arrayBuffer(): Promise<ArrayBuffer>;
	blob(): Promise<Blob>;
	formData(): Promise<FormData>;
	json(): Promise<any>;
	text(): Promise<string>;
}
declare class Response extends Body {
	constructor(body?: BodyInit, init?: ResponseInit);
	error(): Response;
	redirect(url: string, status: number): Response;
	type: ResponseType;
	url: string;
	status: number;
	ok: boolean;
	statusText: string;
	headers: Headers;
	clone(): Response;
}

declare enum ResponseType { 'basic', 'cors', 'default', 'error', 'opaque' }

declare class ResponseInit {
	status: number;
	statusText: string;
	headers: HeaderInit;
}

declare type HeaderInit = Headers | Array<string>;
declare type BodyInit = Blob | FormData | string;
declare type RequestInfo = Request | string;

// declare var fetch: (url: string, init?: RequestInit) => Promise<Response>;
// declare var require: <T>(moduleId: [string], callback: (module: T) => void) => void;
// declare window.require = <T>(moduleId: [string], callback: (module: T) => void) => void;
interface Window {
	require<T>(moduleId: [string], callback: (module: T) => void): void;
	fetch(url: string, init?: RequestInit): Promise<Response>;
}


// let url = `https://raw.githubusercontent.com/golang/example/master/hello/hello.go`;
// let goExample: Promise<string> = fetch(url).then(exampleGo => exampleGo.text());

let urls: string[] = [
	'../../golang/example/appengine-hello/app.go',
	'../../golang/example/gotypes/defsuses/main.go',
	'../../golang/example/gotypes/doc/main.go',
	'../../golang/example/gotypes/hello/hello.go',
	'../../golang/example/gotypes/hugeparam/main.go',
	'../../golang/example/gotypes/implements/main.go',
	'../../golang/example/gotypes/lookup/lookup.go',
	'../../golang/example/gotypes/nilfunc/main.go',
	'../../golang/example/gotypes/pkginfo/main.go',
	'../../golang/example/gotypes/skeleton/main.go',
	'../../golang/example/gotypes/typeandvalue/main.go',
	'../../golang/example/gotypes/weave.go',
	'../../golang/example/hello/hello.go',
	'../../golang/example/outyet/main.go',
	'../../golang/example/outyet/main_test.go',
	'../../golang/example/stringutil/reverse.go',
	'../../golang/example/stringutil/reverse_test.go',
	'../../golang/example/template/main.go'
];

let createExampleFileDom = (examples: string[] = []) => {
	let EXAMPLES_ID = 'example_files';
	// let EXAMPLES_DIV = document.getElementById(EXAMPLES_ID);

	examples.map((exampleFile, index) => {
		let exampleName = urls[index];

		let exampleDiv = document.createElement('div');
		document.getElementById(EXAMPLES_ID).appendChild(exampleDiv);

		let nameNode = document.createElement('h4');
		nameNode.innerHTML = exampleName;
		exampleDiv.appendChild(nameNode);

		let fileNode = document.createElement('span');
		fileNode.style.display = 'block';
		fileNode.style.width = '100%';
		fileNode.style['font-family'] = 'monospace';
		fileNode.innerHTML = exampleFile;
		exampleDiv.appendChild(fileNode);
	});
};

let examplesRequests = urls.map(url => window.fetch(url).then(example => example.text()));
Promise.all(examplesRequests).then((examples) => {
	createExampleFileDom(examples);

	// get this file for now: ../golang/example/gotypes/hello/hello.go
	if (examples.length <= 3) {
		return;
	}

	let goExampleFile = examples[3];

	let onModulesLoaded = function () {
		let domElement: HTMLElement = document.getElementById('container');
		let options: IEditorConstructionOptions = {
			'value': goExampleFile,
			'language': 'go',
			'fontSize': 10,
			'lineNumbers': 'on'
		};

		let editor: IStandaloneCodeEditor = monaco.editor.create(domElement, options);
		if (editor) {
			console.log('editor: %O', editor);
			console.log('editor.model: %O', editor.getModel());
		}

		console.log('monaco.editor.getModels(): %O', monaco.editor.getModels());
		console.log('monaco.editor.getModels()[]: %O', monaco.editor.getModels()[0]);

		window['debug_update_editor'] = () => {
			let value = goExampleFile;
			let language = 'go';
			let model: monaco.editor.IModel = monaco.editor.createModel(value, language);

			monaco.editor.setModelLanguage(model, language);
		};
	};

	window.require([
		'vs/basic-languages/src/monaco.contribution',
		'vs/language/go/monaco.contribution'
	], onModulesLoaded);

}).catch((err) => {
	let msg = `Failed to fetch - err: ${err}`;
	console.error(msg);
});