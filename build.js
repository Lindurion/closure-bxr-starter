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


//==============================================================================
// Command-Line
//==============================================================================

commander.option('--debug', 'Build in debug mode').parse(process.argv);


//==============================================================================
// Project Configuration
//==============================================================================

var ROOT_SRC_DIR = 'src/';
var tmpDir = 'tmp/';
var tmpLessDir = tmpDir + (commander.debug ? 'debug/' : 'release/') + 'less/';

// List of root 3rd party CSS files (relative to this directory).
// Only need to include root files here; all files from @import will be
// included automatically.
//
// CSS class names will NOT be obfuscated for these files (so you can refer to
// them directly--don't use goog.getCssName() or {css} in Soy for class names).
var LESS_INPUT_FILES_3P = [
  '3p/bootstrap-3.0.0/less/bootstrap.less'
];

// For 3rd party CSS: directories to search for @import LESS & CSS files from.
var LESS_INCLUDE_DIRS_3P = [
  '3p/bootstrap-3.0.0/less/'
];

// List of root application LESS & CSS files (relative to this directory).
// Only need to include root files here; all files from @import will be
// included automatically.
//
// CSS class names from these input files will be obfuscated and must be
// accessed with goog.getCssName() in JS and {css aClassName} in Soy.
//
// These files should NOT @import any 3rd party CSS from LESS_INPUT_FILES_3P
// (though importing a 3rd party file that only includes LESS mixins--
// including no style definitions--is okay).
var LESS_INPUT_FILES_APP = [
  ROOT_SRC_DIR + 'ui/main.less'
];

// For application CSS: directories to search for @import LESS & CSS files from.
var LESS_INCLUDE_DIRS_APP = [ROOT_SRC_DIR];

// Path to compiled CSS file for 3rd party CSS.
var compiledLessFile3P = tmpLessDir + '3p.css';

// Path to compiled CSS file for application CSS.
var compiledLessFileApp = tmpLessDir + 'app.css';

// The closure-pro-build project options.
var projectOptions = {
  rootSrcDir: ROOT_SRC_DIR,
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
  tempFileDir: tmpDir
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
  return lessBuilder.build(LESS_INPUT_FILES_3P, LESS_INCLUDE_DIRS_3P,
      {debug: commander.debug}, compiledLessFile3P);
}

function buildAppCss() {
  return lessBuilder.build(LESS_INPUT_FILES_APP, LESS_INCLUDE_DIRS_APP,
      {debug: commander.debug}, compiledLessFileApp);
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
