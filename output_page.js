#!/usr/bin/env node

var fs = require('fs');

// Read and eval library
filedata = fs.readFileSync('./build/debug/page.js', 'utf8');
eval(filedata);

console.log(this['cbxrs']['ui']['page']['soy']['main']());
