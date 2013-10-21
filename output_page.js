#!/usr/bin/env node

// Note: This file is temporary, for testing, until express server is ready.

var commander = require('commander');
var fs = require('fs');

commander.option('--debug', 'Build in debug mode').parse(process.argv);
var dir = commander.debug ? 'debug' : 'release';

// Read and eval library.
filedata = fs.readFileSync('./build/' + dir + '/page.js', 'utf8');
(function() { eval.call(this, filedata); })();

console.log(cbxrs.ui.page.soy.main());
