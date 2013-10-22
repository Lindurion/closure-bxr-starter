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
var kew = require('kew');
var projectConfig = require('./project-config.js');


/**
 * Builds full Closure project.
 * @param {string} compiledLessFileApp Application CSS file.
 * @param {string} compiledLessFile3P 3rd party CSS file.
 * @param {!{debug: boolean}} options
 * @return {!Promise} Tracks success/failure.
 */
function build(compiledLessFileApp, compiledLessFile3P, options) {
  // TODO: Switch to kew.nfcall() when next version of kew is pushed to npm.
  var promise = kew.defer();
  closureProBuild.build(
      getProjectOptions(compiledLessFileApp, compiledLessFile3P),
      getBuildOptions(options),
      promise.makeNodeResolver());
  return promise;
}


/**
 * @param {string} compiledLessFileApp Application CSS file.
 * @param {string} compiledLessFile3P 3rd party CSS file.
 * @return {!Object}
 */
function getProjectOptions(compiledLessFileApp, compiledLessFile3P) {
  return {
    rootSrcDir: projectConfig.OPTIONS.rootSrcDir,
    cssModule: {
      name: 'style',
      description: 'All CSS styles for the project',
      closureInputFiles: [compiledLessFileApp],
      dontCompileInputFiles: [compiledLessFile3P]
    },
    jsModules: projectConfig.JS_MODULES,
    jsExterns: projectConfig.JS_EXTERNS
  };
}


/**
 * @param {!{debug: boolean}} options
 * @return {!Object}
 */
function getBuildOptions(options) {
  return {
    type: options.debug ? closureProBuild.DEBUG : closureProBuild.RELEASE,
    generatedCodeDir: projectConfig.OPTIONS.generatedCodeDir,
    tempFileDir: projectConfig.OPTIONS.tempFileDir,
    outputDir: projectConfig.OPTIONS.outputDir
  };
}


// Symbols exported by this internal module.
module.exports = {build: build};
