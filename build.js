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

var closureProjectBuilder = require('./lib/closure-project-builder.js');
var commander = require('commander');
var kew = require('kew');
var lessBuilder = require('./lib/less-builder.js');
var mkdirp = require('mkdirp');
var path = require('path');
var projectConfig = require('./project-config.js');


//==============================================================================
// Options
//==============================================================================

commander.option('--debug', 'Build in debug mode').parse(process.argv);

var tmpLessDir = path.join(projectConfig.OPTIONS.tempFileDir,
    (commander.debug ? 'debug/' : 'release/'), 'less/');
var compiledLessFile3P = path.join(tmpLessDir, '3p.css');
var compiledLessFileApp = path.join(tmpLessDir, 'app.css');


//==============================================================================
// Build Project
//==============================================================================

function makeTmpLessDir() {
  // TODO: Switch to kew.nfcall() when next version of kew is pushed to npm.
  var promise = kew.defer();
  mkdirp(tmpLessDir, promise.makeNodeResolver());
  return promise;
}

function build3pCss() {
  return lessBuilder.build(projectConfig.CSS_3P.inputFiles,
      projectConfig.CSS_3P.includeDirs, {debug: commander.debug},
      compiledLessFile3P);
}

function prependRootSrcDir(fileOrDir) {
  return path.join(projectConfig.OPTIONS.rootSrcDir, fileOrDir);
}

function buildAppCss() {
  var inputFiles = projectConfig.CSS_APP.inputFiles.map(prependRootSrcDir);
  var includeDirs = projectConfig.CSS_APP.includeDirs.map(prependRootSrcDir);
  return lessBuilder.build(inputFiles, includeDirs, {debug: commander.debug},
      compiledLessFileApp);
}

function buildClosureProject() {
  return closureProjectBuilder.build(compiledLessFileApp, compiledLessFile3P,
      {debug: commander.debug});
}


// Run all project build steps.
makeTmpLessDir()
    .then(function() { return kew.all([build3pCss(), buildAppCss()]); })
    .then(buildClosureProject)
    .then(function() { console.log('Project built successfully'); })
    .fail(function(e) {
      console.error('Failed to build project: ' + e);
      throw e;
    })
    .end();
