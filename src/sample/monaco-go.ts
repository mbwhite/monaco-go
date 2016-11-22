/// <reference path="./whatwg-fetch.d.ts" />

import Emitter = monaco.Emitter;
import IEditorConstructionOptions = monaco.editor.IEditorConstructionOptions;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

declare var fetch: typeof window.fetch;
declare var require: <T>(moduleId: [string], callback: (module: T) => void) => void;

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

let examplesRequests = urls.map(url => fetch(url).then(example => example.text()));
Promise.all(examplesRequests).then((examples) => {
	// get this file for now: ../golang/example/gotypes/hello/hello.go
	if (examples.length <= 3) {
		return;
	}

	let goExampleFile = examples[3];
	require([
		'vs/basic-languages/src/monaco.contribution',
		'vs/language/go/monaco.contribution'
	], function () {

		let domElement: HTMLElement = document.getElementById('container');
		let options: IEditorConstructionOptions = {
			"value": goExampleFile,
			"language": 'go',
			"fontSize": 10,
			"lineNumbers": "on"
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
	});
}).catch((err) => {
	let msg = `Failed to fetch - url: ${url}, err: ${err}`;
	console.error(msg);
});