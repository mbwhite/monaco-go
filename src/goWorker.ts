/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import Promise = monaco.Promise;
import IWorkerContext = monaco.worker.IWorkerContext;

// import * as ls from 'vscode-languageserver-types';

export class GoWorker {

	// --- model sync -----------------------

	private _ctx:IWorkerContext;
	// private _languageService: cssService.LanguageService;
	// private _languageService: goService.LanguageService;
	// private _languageSettings: cssService.LanguageSettings;
	// private _languageSettings: goService.LanguageSettings;
	private _languageId: string;

	constructor(ctx:IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;

		console.log('createData: ', createData);

		this._languageId = 'go';
		// this._languageSettings = createData.languageSettings;
		// this._languageId = createData.languageId;
		// switch (this._languageId) {
		// 	case 'go':
		// 		// this._languageService = cssService.getCSSLanguageService();
		// 		this._languageService = goService.getGoLanguageService();
		// 		break;
		// 	default:
		// 		throw new Error('Invalid language id: ' + this._languageId);
		// }
		// this._languageService.configure(this._languageSettings);
	}

	// --- language service host ---------------

    // doValidation(uri: string): Promise<ls.Diagnostic[]> {
	doValidation(uri: string): Promise<any> {
		return new Promise((resolve, reject) => {

		});
		// let document = this._getTextDocument(uri);
		// let stylesheet = this._languageService.parseStylesheet(document);
		// let diagnostics = this._languageService.doValidation(document, stylesheet);
		// return Promise.as(diagnostics);
	}
    // doComplete(uri: string, position: ls.Position): Promise<ls.CompletionList> {
    doComplete(uri: string, position: any): Promise<any> {
		return new Promise((resolve, reject) => {

		});
		// let document = this._getTextDocument(uri);
		// let stylesheet = this._languageService.parseStylesheet(document);
		// let completions = this._languageService.doComplete(document, position, stylesheet);
		// return Promise.as(completions);
	}
    // doHover(uri: string, position: ls.Position): Promise<ls.Hover> {
    doHover(uri: string, position: any): Promise<any> {
		return new Promise((resolve, reject) => {

		});
		// let document = this._getTextDocument(uri);
		// let stylesheet = this._languageService.parseStylesheet(document);
		// let hover = this._languageService.doHover(document, position, stylesheet);
		// return Promise.as(hover);
	}
    // findDefinition(uri: string, position: ls.Position): Promise<ls.Location> {
    findDefinition(uri: string, position: any): Promise<any> {
		return new Promise((resolve, reject) => {

		});
		// let document = this._getTextDocument(uri);
		// let stylesheet = this._languageService.parseStylesheet(document);
		// let definition = this._languageService.findDefinition(document, position, stylesheet);
		// return Promise.as(definition);
	}
    // findReferences(uri: string, position: ls.Position): Promise<ls.Location[]> {
    findReferences(uri: string, position: any): Promise<any> {
		return new Promise((resolve, reject) => {

		});
		// let document = this._getTextDocument(uri);
		// let stylesheet = this._languageService.parseStylesheet(document);
		// let references = this._languageService.findReferences(document, position, stylesheet);
		// return Promise.as(references);
	}
    // findDocumentHighlights(uri: string, position: ls.Position): Promise<ls.DocumentHighlight[]> {
    findDocumentHighlights(uri: string, position: any): Promise<any> {
		return new Promise((resolve, reject) => {

		});
		// let document = this._getTextDocument(uri);
		// let stylesheet = this._languageService.parseStylesheet(document);
		// let highlights = this._languageService.findDocumentHighlights(document, position, stylesheet);
		// return Promise.as(highlights);
	}
    // findDocumentSymbols(uri: string): Promise<ls.SymbolInformation[]> {
    findDocumentSymbols(uri: string): Promise<any> {
		return new Promise((resolve, reject) => {

		});
		// let document = this._getTextDocument(uri);
		// let stylesheet = this._languageService.parseStylesheet(document);
		// let symbols = this._languageService.findDocumentSymbols(document, stylesheet);
		// return Promise.as(symbols);
	}
    // doCodeActions(uri: string, range: ls.Range, context: ls.CodeActionContext): Promise<ls.Command[]> {
    doCodeActions(uri: string, range: any, context: any): Promise<any> {
		return new Promise((resolve, reject) => {

		});
		// let document = this._getTextDocument(uri);
		// let stylesheet = this._languageService.parseStylesheet(document);
		// let actions = this._languageService.doCodeActions(document, range, context, stylesheet);
		// return Promise.as(actions);
	}
    // findColorSymbols(uri: string): Promise<ls.Range[]> {
    findColorSymbols(uri: string): Promise<any> {
		return new Promise((resolve, reject) => {

		});
		// let document = this._getTextDocument(uri);
		// let stylesheet = this._languageService.parseStylesheet(document);
		// let colorSymbols = this._languageService.findColorSymbols(document, stylesheet);
		// return Promise.as(colorSymbols);
	}
    // doRename(uri: string, position: ls.Position, newName: string): Promise<ls.WorkspaceEdit> {
    doRename(uri: string, position: any, newName: string): Promise<any> {
		return new Promise((resolve, reject) => {

		});
		// let document = this._getTextDocument(uri);
		// let stylesheet = this._languageService.parseStylesheet(document);
		// let renames = this._languageService.doRename(document, position, newName, stylesheet);
		// return Promise.as(renames);
	}
	// private _getTextDocument(uri: string): ls.TextDocument {
	// 	let models = this._ctx.getMirrorModels();
	// 	for (let model of models) {
	// 		if (model.uri.toString() === uri) {
	// 			return ls.TextDocument.create(uri, this._languageId, model.version, model.getValue());
	// 		}
	// 	}
	// 	return null;
	// }
}

export interface ICreateData {
	languageId: string;
	languageSettings: {
		readonly validate?: boolean;
		readonly lint?: {
			readonly compatibleVendorPrefixes?: 'ignore' | 'warning' | 'error',
			readonly vendorPrefix?: 'ignore' | 'warning' | 'error',
			readonly duplicateProperties?: 'ignore' | 'warning' | 'error',
			readonly emptyRules?: 'ignore' | 'warning' | 'error',
			readonly importStatement?: 'ignore' | 'warning' | 'error',
			readonly boxModel?: 'ignore' | 'warning' | 'error',
			readonly universalSelector?: 'ignore' | 'warning' | 'error',
			readonly zeroUnits?: 'ignore' | 'warning' | 'error',
			readonly fontFaceProperties?: 'ignore' | 'warning' | 'error',
			readonly hexColorLength?: 'ignore' | 'warning' | 'error',
			readonly argumentsInColorFunction?: 'ignore' | 'warning' | 'error',
			readonly unknownProperties?: 'ignore' | 'warning' | 'error',
			readonly ieHack?: 'ignore' | 'warning' | 'error',
			readonly unknownVendorSpecificProperties?: 'ignore' | 'warning' | 'error',
			readonly propertyIgnoredDueToDisplay?: 'ignore' | 'warning' | 'error',
			readonly important?: 'ignore' | 'warning' | 'error',
			readonly float?: 'ignore' | 'warning' | 'error',
			readonly idSelector?: 'ignore' | 'warning' | 'error'
		}
	};
}

export function create(ctx:IWorkerContext, createData: ICreateData): GoWorker {
	return new GoWorker(ctx, createData);
}
