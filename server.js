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

var child_process = require('child_process');
var commander = require('commander');
var express = require('express');
var nodeWatch = require('node-watch');
var path = require('path');
var projectConfig = require('./project-config.js');
var soy = require('./lib/soy.js');
var underscore = require('underscore');


var EXIT_SUCCESS = 0;
var app = express();


//==============================================================================
// Command-Line Options
//==============================================================================

commander
    .option('--debug', 'Run server to server application built in --debug mode')
    .option('--port <port>', 'Port to run HTTP server on', Number, 8080)
    .option('--watch', 'Watch for changes under this dir and rebuild on demand')
    .parse(process.argv);


//==============================================================================
// Configure Soy Template Rendering
//==============================================================================

// Configure all server-side rendered Soy templates here.
var outDir = path.join(__dirname, projectConfig.OPTIONS.outputDir,
    commander.debug ? 'debug/' : 'release/');
var soyRenderer = new soy.SoyRenderer(outDir, {
  'cbxrs.ui.page.soy.main': 'page.js'
});

app.disable('view cache');  // SoyRenderer does own caching.
app.set('views', outDir);
app.engine('.js', underscore.bind(soyRenderer.render, soyRenderer));


//==============================================================================
// Watch for File Changes & Trigger Rebuilds
//==============================================================================

function rebuild(callbackFn) {
  console.log('Rebuilding project, changes detected since last build...\n');
  soyRenderer.invalideCachedTemplates();

  var args = [path.join(__dirname, 'build.js')];
  if (commander.debug) {
    args.push('--debug');
  }
  var projectBuilder = child_process.spawn('node', args, {stdio: 'inherit'});
  projectBuilder.on('close', function(exitCode) {
    if (exitCode != EXIT_SUCCESS) {
      callbackFn(new Error('Rebuilding project failed'));
    } else {
      console.log('\nRebuilding project succeeded...');
      callbackFn(null);
    }
  });
}


function normalizePath(path) {
  return path.replace(/\\/g, '/');
}


// Ignore changes to files under output directories to avoid change cycles.
var IGNORE_CHANGES = new RegExp(
    '(' + normalizePath(projectConfig.OPTIONS.generatedCodeDir) + '|' +
    normalizePath(projectConfig.OPTIONS.tempFileDir) + '|' +
    normalizePath(projectConfig.OPTIONS.outputDir) + ')');


if (commander.watch) {
  var needsRebuild = false;
  var rebuildInProgress = false;
  var lastRebuildFailed = false;

  nodeWatch(__dirname, {persistent: false}, function(fileName) {
    if (IGNORE_CHANGES.test(normalizePath(fileName))) {
      return;
    }

    // Some file under this directory changed.
    needsRebuild = true;
  });

  // Install this middleware to check if rebuild is needed before each request.
  var pendingContinueFns = [];
  app.use(function(req, res, continueFn) {
    if (!needsRebuild) {
      if (lastRebuildFailed) {
        throw new Error('Last project rebuild failed. Fix errors & try again.');
      }
      continueFn(null);
      return;
    }

    pendingContinueFns.push(continueFn);

    if (!rebuildInProgress) {
      rebuildInProgress = true;
      rebuild(function(err) {
        rebuildInProgress = false;
        needsRebuild = false;
        lastRebuildFailed = !!err;
        pendingContinueFns.forEach(function(fn) { fn(err); });
        pendingContinueFns = [];
      });
    }
  });

  console.log('Watching for file changes under this dir...');
} else {
  console.log('Not watching for file changes...');
}


//==============================================================================
// Configure HTTP Request Path Handlers
//==============================================================================

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

// Error page:
app.use(function(err, req, res, next) {
  console.error('Request had failures:\n' + err);
  res.send(500,
      'Sorry :( something went wrong. Tell whoever runs this site to check ' +
      'their server logs (and to install a prettier error page).');
});


//==============================================================================
// Start Accepting Requests
//==============================================================================

console.log('Listening for HTTP requests on port ' + commander.port);
app.listen(commander.port);
