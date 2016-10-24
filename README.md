# Monaco go

<del>
CSS language plugin for the Monaco Editor. It provides the following features when editing CSS, LESS and SCSS files:
* Code completion
* Hovers
* Validation: Syntax errors and linting
* Find definition, references & highlights for symbols in the same file
* Document Symbols
</del>

<del>
Linting an be configured through the API. See [here](https://github.com/Microsoft/monaco-go/blob/master/src/monaco.d.ts) for the API that the
CSS plugin offers to configure the CSS/LESS/SCSS language support.
</del>

<del>
Internally the CSS plugin uses the [vscode-go-languageservice](https://github.com/Microsoft/vscode-go-languageservice)
node module, providing the implementation of the functionally listed above. The same module is also used
in [Visual Studio Code](https://github.com/Microsoft/vscode) to power the CSS, LESS and SCSS editing experience.
</del>

## Issues

<del>
Please file issues concering `monaco-go` in the [`monaco-editor` repository](https://github.com/Microsoft/monaco-editor/issues).
</del>

## Installing

This npm module is bundled and distributed in the [monaco-editor](https://www.npmjs.com/package/monaco-editor) npm module.

## Development

Requires <https://github.com/mbana/vscode-go-languageservice>.

```sh
git clone git@github.com:mbana/vscode-go-languageservice.git
git clone git@github.com:mbana/monaco-go.git

cd vscode-go-languageservice && \
    npm install && \
    sudo npm link && \
    cd ..

cd monaco-go && \
    npm link vscode-go-languageservice && \
    npm install && \
    npm run watch
```

```sh
open monaco-go/test/index.html
```

## License
[MIT](https://github.com/Microsoft/monaco-go/blob/master/LICENSE.md)
