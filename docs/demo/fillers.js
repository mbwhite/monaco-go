let Buffer = function (str, encoding) {
	var uint8array = new TextEncoder(encoding).encode(str);
	return uint8array;
};

let process = {
	platform: 'win32',
	kill: function (signal) {
		// signal: 'SIGKILL'
	},
	env: {
	}
};

define('child_process', function () {
	let child_process = {
		ChildProcess: {
		}
	};

	return child_process;
});

define('net', function () {
	let net = {
		connect: function () {
			return {
				unref: function () {
				}
			}
		},
		createServer: function () {
			return {
				listen: function () {
				}
			}
		},
	};

	return net;
});

define('path', function () {
	let path = {
	};

	return path;
});

define('os', function () {
	let os = {
	};

	return os;
});

define('fs', function () {
	let fs = {
	};

	return fs;
});

define('stream', function () {
	let stream = {
	};

	return stream;
});

define('util', function () {
	let util = {
	};

	return util;
});