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
var kew = require('kew');
var lessBuilder = require('./less-builder.js');
var path = require('path');
var projectConfig = require('./project-config.js');
var recess = require('recess');


var EXIT_SUCCESS = 0;


//==============================================================================
// Run CSS/LESS & JS Lint Checks
//==============================================================================

function runJsLintChecksAsync() {
  console.log('\nRunning JS lint checks...');
  var rootDir = path.join(__dirname, projectConfig.OPTIONS.rootSrcDir);

  // Some common options projects may want to change:
  //   --strict: Checks stricter rules like line spacing
  //   --nojsdoc: For projects not using jsDoc type annotations
  // Run gjslint --help to see a complete list of options.
  var jsLintOptions = ['-r', rootDir, '--strict'];
  var jsLinter =
      child_process.spawn('gjslint', jsLintOptions, {stdio: 'inherit'});
  var promise = kew.defer();

  jsLinter.on('error', function(err) {
    console.error('Unable to run Closure linter.\n' +
        'Make sure gjslint is installed and on your path. See:\n' +
        '  http://developers.google.com/closure/utilities/docs/linter_howto');
    promise.reject(err);
  });

  jsLinter.on('close', function(exitCode) {
    if (exitCode != EXIT_SUCCESS) {
      promise.reject(new Error('JS linter had errors'));
    } else {
      promise.resolve(null);
    }
  });

  return promise;
}


function prependRootSrcDir(fileOrDir) {
  return path.join(projectConfig.OPTIONS.rootSrcDir, fileOrDir);
}


function runRecessLintChecksAsync() {
  console.log('\nRunning CSS/LESS lint checks...');
  var inputFiles = projectConfig.CSS_APP.inputFiles.map(prependRootSrcDir);
  var includeDirs = projectConfig.CSS_APP.includeDirs.map(prependRootSrcDir);

  // Note: To customize which CSS/LESS lint rules are enforced, see
  // CUSTOM_RECESS_OPTIONS in project-config.js.
  var lintAsync = lessBuilder.build(inputFiles, includeDirs,
      {debug: true, lintMode: true}, null);
  return lintAsync.then(function() { console.log('No CSS/LESS issues'); });
}


runJsLintChecksAsync()
    .then(runRecessLintChecksAsync)
    .then(function() { console.log('\nSUCCESS: No lint warnings'); })
    .end();
