import Emitter = monaco.Emitter;
import IEditorConstructionOptions = monaco.editor.IEditorConstructionOptions;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

let exampleUrl = `https://raw.githubusercontent.com/golang/example/master/hello/hello.go`;

fetch(exampleUrl).then(exampleGo => exampleGo.text()).then(exampleGo => {
    require([
        'vs/basic-languages/src/monaco.contribution',
        'vs/language/go/monaco.contribution'
    ], function () {
        let GoMode = monaco.languages.go.goDefaults;
        // let languageId = GoMode.languageId;
        let GO_LANGUAGE_ID = 'go';

        let domElement: HTMLElement = document.getElementById('container');
        let options: IEditorConstructionOptions = {
            "value": exampleGo,
            "language": GO_LANGUAGE_ID,
            "fontSize": 10,
            "lineNumbers": "on",
        };

        let editor: IStandaloneCodeEditor = monaco.editor.create(domElement, options);
        if (editor) {
            console.log('editor: %O', editor);
            console.log('editor.model: %O', editor.getModel());
        }

        console.log('monaco.editor.getModels(): %O', monaco.editor.getModels());
        console.log('monaco.editor.getModels()[]: %O', monaco.editor.getModels()[0]);

        window.debug_update_editor = () => {
            let value = exampleGo;
            let language = GO_LANGUAGE_ID;
            let model: monaco.editor.IModel = monaco.editor.createModel(value, language);

            monaco.editor.setModelLanguage(model, language);
        };
    });
})

