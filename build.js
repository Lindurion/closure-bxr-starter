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

var closureProBuild = require('closure-pro-build');
var commander = require('commander');
var kew = require('kew');
var lessBuilder = require('./less-builder.js');
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

// The closure-pro-build project options.
var projectOptions = {
  rootSrcDir: projectConfig.OPTIONS.rootSrcDir,
  cssModule: {
    name: 'style',
    description: 'All CSS styles for the project',
    closureInputFiles: [compiledLessFileApp],
    dontCompileInputFiles: [compiledLessFile3P]
  },
  // TODO: Add JS modules, including app JS and 3p jQuery.
  jsModules: {}
};

// The closure-pro-build build options.
// TODO: Add command-line args support for debug or release.
var buildOptions = {
  type: commander.debug ? closureProBuild.DEBUG : closureProBuild.RELEASE,
  generatedCodeDir: projectConfig.OPTIONS.generatedCodeDir,
  tempFileDir: projectConfig.OPTIONS.tempFileDir,
  outputDir: projectConfig.OPTIONS.outputDir
};


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
  // TODO: Switch to kew.nfcall() when next version of kew is pushed to npm.
  var promise = kew.defer();
  closureProBuild.build(projectOptions, buildOptions,
      promise.makeNodeResolver());
  return promise;
}


// Run all project build steps.
makeTmpLessDir()
    .then(function() { return kew.all([build3pCss(), buildAppCss()]); })
    .then(buildClosureProject)
    .then(function() { console.out('Project built successfully'); })
    .fail(function(e) { console.error('Failed to build project: ' + e); });
