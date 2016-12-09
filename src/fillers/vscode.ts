import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import IModel = monaco.editor.IModel;

declare type TextDocument = IModel;

class OutputChannel {
	private _name: string = 'OutputChannel';
	private _hide: boolean;

	public constructor(name: string = 'OutputChannel') {
		this._name = name;
		this._hide = true;
	}

	public appendLine(value) {
		if (!this._hide) {
			let message = `LanguageClient:${this._name} - `;
			console.info(message, value);
		}
	}

	public show(preserveFocus) {
		this._hide = false;
	}

	public hide() {
		this._hide = true;
	}
}

class WorkspaceConfig {
	private _id: string = 'langserver-antha';
	private _sections: {};

	public constructor(id: string = 'langserver-antha') {
		this._id = id;
		this._sections = {
			'trace.server': 'verbose'
		};
	}

	public get id() {
		return this._id;
	}

	public get(section, defaultValue) {
		try {
			let value = this._sections[section];

			if (value) {
				return value;
			} else {
				return defaultValue;
			}
		} catch (err) {
			return defaultValue;
		}
	}
}

class Workspace {
	private _workspaceConfigs: WorkspaceConfig[];
	private _textDocuments: TextDocument[];
	private _onDidOpenTextDocument = new Emitter<TextDocument>();

	public rootPath: string;

	public constructor(
		rootPath: string = '/Users/mbana/go/src/github.com/sourcegraph/go-langserver',
		workspaceConfigs: WorkspaceConfig[] = [new WorkspaceConfig()]
	) {
		this.rootPath = rootPath;
		this._workspaceConfigs = workspaceConfigs;
		this._textDocuments = [];

		monaco.editor.getModels().forEach(this._onModelAdd, this);
	}

	private _onModelAdd(model: monaco.editor.IModel): void {
		// let modeId = model.getModeId();

		// let handle: number;
		// this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
		// 	clearTimeout(handle);
		// 	handle = window.setTimeout(() => this._doValidate(model.uri, modeId), 500);
		// });

		// this._doValidate(model.uri, modeId);

		this._textDocuments.push(model);
		this._onDidOpenTextDocument.fire(model);
	}

	public get onDidOpenTextDocument(): IEvent<TextDocument> {
		return this._onDidOpenTextDocument.event;
	}

	public get textDocuments() {
		return this._textDocuments;
	}

	public getConfiguration(id: string): WorkspaceConfig | undefined {
		return this._workspaceConfigs.find((config: WorkspaceConfig) => {
			return config.id === id;
		});
	}
}

export function CompletionItem() { };
export function CodeLens() { };
export function Disposable() { };
export const languages = {
	createDiagnosticCollection() {
		return {};
	}
};
export const workspace = new Workspace();
export const window = {
	createOutputChannel(name) {
		return new OutputChannel(name);
	},
	showErrorMessage() { },
	showInformationMessage() { },
	showWarningMessage() { },
};