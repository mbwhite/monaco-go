import {
	DataCallback,
	MessageWriter, MessageReader,
	Message, PartialMessageInfo,
	StreamInfo
} from 'vscode-languageclient';
import {
	WebSocketMessageReader
} from './web-socket-reader';
import {
	WebSocketMessageWriter
} from './web-socket-writer';
import { UIHooks } from '../monaco.contribution';

export {
	WebSocketMessageReader, WebSocketMessageWriter
}

export class WebSocketStream implements StreamInfo {
	writer: any;
	reader: any;

	constructor(private ws: WebSocket, private uiHooks: UIHooks) {
		this.writer = new WebSocketMessageWriter(ws, uiHooks);
		this.reader = new WebSocketMessageReader(ws, uiHooks);
	}

	static getWorkspaceConfig() {
		// run the below in the console then refresh when doing local dev.
		//
		// let langserverConfigJson = {
		// 	hostname: '13.65.101.250',
		// 	port: 4389,
		// 	scheme: 'ws'
		// };
		// let langserverConfigStr = JSON.stringify(langserverConfigJson);
		// localStorage.setItem('monaco.workspace.go.langserver', langserverConfigStr);


		const CONFIG_KEY = 'monaco.workspace.go.langserver';

		let configStr = localStorage.getItem(CONFIG_KEY);
		return JSON.parse(configStr);
	}

	static createUrl() {
		let workspaceConfig = WebSocketStream.getWorkspaceConfig();

		let scheme = WebSocketStream.getDefaultScheme();
		if (workspaceConfig && workspaceConfig.scheme) {
			scheme = workspaceConfig.scheme;
		}

		// location.host
		// "13.65.101.250:8080"
		// location.hostname
		// "13.65.101.250"
		let host = {
			hostname: location.hostname,
			port: '4389',
		};

		if (workspaceConfig && workspaceConfig.hostname) {
			host.hostname = workspaceConfig.hostname;
		}

		if (workspaceConfig && workspaceConfig.port) {
			host.port = workspaceConfig.port;
		}

		return `${scheme}://${host.hostname}/ws`;
		// return WebSocketStream.doCreateUrl(scheme, host);
	}

	// static doCreateUrl(scheme, host) {
	// 	let isSecure = WebSocketStream.isSecure();
	// 	// return with port, otherwise remove port
	// 	// we're going to use a proxy in the nginx conf
	// 	if (!isSecure) {
	// 		return `${scheme}://${host.hostname}:${host.port}`;
	// 	} else {
	// 		return `${scheme}://${host.hostname}/ws`;
	// 	}
	// 	// return `${scheme}://${host.hostname}/ws`;
	// }

	static getDefaultScheme() {
		let isSecure = WebSocketStream.isSecure();
		return isSecure ? 'wss' : 'ws';
	}

	static isSecure() {
		let protocol = location.protocol;
		if (protocol.includes('https:')) {
			return true;
		} else {
			return false;
		}
	}

	static create(uiHooks: UIHooks): Promise<StreamInfo> {
		return new Promise((resolve, reject) => {
			let ws: WebSocket;

			try {
				let url = WebSocketStream.createUrl();
				ws = new WebSocket(url);

				ws.onopen = (ev: Event): any => {
					let streamInfo: StreamInfo = new WebSocketStream(ws, uiHooks);
					resolve(streamInfo);
				};
			} catch (err) {
				reject(err);
			}

			ws.onclose = (ev: CloseEvent): any => {
				console.error('WebSocketStream:onclose - CloseEvent: ', ev);
				reject(ev);
			};
			ws.onerror = (ev: ErrorEvent): any => {
				console.error('WebSocketStream:onerror - ErrorEvent: ', ev);
				reject(ev);
			};
			ws.onmessage = (ev: MessageEvent): any => {
				// console.info('WebSocketStream:onmessage - MessageEvent: ', ev);
			};
		});
	}
}