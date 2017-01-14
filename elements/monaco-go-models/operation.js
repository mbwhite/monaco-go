class MonacoGoOperationInProgress {
	constructor(id = '', params = '', inProgress = false) {
		this.id = id;
		this.params = params;
		this.inProgress = inProgress;
	}
}

class MonacoGoOperationUiHooks {
	constructor(onRequestStart, onRequestEnd, extra) {
		this.onRequestStart = onRequestStart;
		this.onRequestEnd = onRequestEnd;
		this.extra = extra;
	}

	// onRequestStart: (details: any) => void;
	// onRequestEnd: (details: any) => void;
	// extra: any;
}