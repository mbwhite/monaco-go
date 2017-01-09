// run below in browser console to use the remote langserver
let langserverConfigJson = {
	hostname: '13.65.101.250',
	port: 4389,
	scheme: 'ws'
};
let langserverConfigStr = JSON.stringify(langserverConfigJson);

localStorage.setItem('monaco.workspace.go.langserver', langserverConfigStr);