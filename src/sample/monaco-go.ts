/// <reference path="./whatwg-fetch.d.ts" />

import Promise = monaco.Promise;
import Emitter = monaco.Emitter;
import IEditorConstructionOptions = monaco.editor.IEditorConstructionOptions;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

declare var fetch: typeof window.fetch;
declare var require: <T>(moduleId: [string], callback: (module: T) => void) => void;

let url = `https://raw.githubusercontent.com/golang/example/master/hello/hello.go`;
let goExample: Promise<string> = fetch(url).then(exampleGo => exampleGo.text());

goExample.then((goExampleFile: string) => {
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
}, (err) => {
	let msg = `Failed to fetch - url: ${url}, err: ${err}`;
	console.error(msg);
});