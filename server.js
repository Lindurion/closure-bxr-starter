#!/usr/bin/env node

// Copyright 2013 Eric W. Barndollar.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var commander = require('commander');
var express = require('express');
var path = require('path');
var soy = require('./soy.js');
var underscore = require('underscore');


//==============================================================================
// Command-Line Options
//==============================================================================

commander
    .option('--debug', 'Run server to server application built in --debug mode')
    .option('-p, --port <port>', 'Port to run HTTP server on', Number, 8080)
    .parse(process.argv);


//==============================================================================
// Configure & Run HTTP Server
//==============================================================================

// Configure all server-side rendered Soy templates here.
var outDir = commander.debug ? './build/debug' : './build/release';
var soyRenderer = new soy.SoyRenderer(outDir, {
  'cbxrs.ui.page.soy.main': 'page.js'
});


// Configure express application server for rendering Soy templates.
var app = express();
app.disable('view cache');  // SoyRenderer does own caching.
app.set('views', outDir);
app.engine('.js', underscore.bind(soyRenderer.render, soyRenderer));

// Main page:
app.get('/', function(req, res) {
  res.render('page.js', {templateName: 'cbxrs.ui.page.soy.main'});
});

// Static JS and CSS:
// (Note that a more complex project may want to copy these files into a
// dedicated directory for express.static() usage).
app.get('/main.js', function(req, res) {
  res.sendfile(path.join(outDir, 'main.js'));
});
app.get('/style.css', function(req, res) {
  res.sendfile(path.join(outDir, 'style.css'));
});

console.log('Listening for HTTP requests on port ' + commander.port);
app.listen(commander.port);
