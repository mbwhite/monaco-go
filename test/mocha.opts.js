// Use "tdd" interface.  This is a shortcut to setting the interface;
// any other options must be passed via an object.
mocha.setup('tdd');

// This is equivalent to the above.
mocha.setup({
	ui: 'tdd'
});

// Use "tdd" interface, ignore leaks, and force all tests to be asynchronous
mocha.setup({
	ui: 'tdd',
	ignoreLeaks: true,
	asyncOnly: true
});