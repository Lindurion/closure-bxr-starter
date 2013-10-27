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
var fs = require('fs');
var kew = require('kew');
var recess = require('recess');
var underscore = require('underscore');


/**
 * Compiles inputFiles using RECESS and writes to outputFile.
 * @param {!Array.<string>} inputFiles
 * @param {!Array.<string>} includeDirs
 * @param {!{debug: boolean}} options
 * @param {string} outputFile
 * @return {!Promise} Tracks success/failure of LESS compilation.
 */
function build(inputFiles, includeDirs, options, outputFile) {
  return resolveLessInputFiles(inputFiles)
      .then(function(resolvedInputFiles) {
        return compile(resolvedInputFiles, includeDirs, options);
      }).then(underscore.partial(writeCssToFile, outputFile));
}


/**
 * @param {!Array.<string>} inputFiles Files and glob patterns.
 * @return {!Promise.<!Array.<string>>} Yields resolved file list.
 */
function resolveLessInputFiles(inputFiles) {
  // TODO: Switch to kew.nfcall() when next version of kew is pushed to npm.
  var promise = kew.defer();
  closureProBuild.expandFileGlobs(inputFiles, '.', promise.makeNodeResolver());
  return promise;
}


/**
 * @param {!Array.<string>} inputFiles
 * @param {!Array.<string>} includeDirs
 * @param {!{debug: boolean}} options
 * @return {!Promise} Yields RECESS compiled results on success.
 */
function compile(inputFiles, includeDirs, options) {
  var recessOptions = {
    compile: true,
    compress: !options.debug,
    includePath: includeDirs,
    prefixWhitespace: false
  };

  // TODO: Switch to kew.nfcall() when next version of kew is pushed to npm.
  var promise = kew.defer();
  recess(inputFiles, recessOptions, promise.makeNodeResolver());
  return promise;
}


/**
 * @param {string} outputFile
 * @param {!Array.<!RECESS>} compiledResults
 * @return {!Promise} Tracks success/failure of written file.
 */
function writeCssToFile(outputFile, compiledResults) {
  // TODO: Switch to kew.nfcall() when next version of kew is pushed to npm.
  var promise = kew.defer();
  fs.writeFile(outputFile, getCssAsString(compiledResults),
      promise.makeNodeResolver());
  return promise;
}


/**
 * @param {!Array.<!RECESS>} compiledResults
 * @return {string}
 */
function getCssAsString(compiledResults) {
  var outputCss = [];
  for (var i = 0; i < compiledResults.length; i++) {
    var result = compiledResults[i];
    outputCss = outputCss.concat(compiledResults[i].output);
  }
  return outputCss.join('');
}


// Symbols exported by this internal module.
module.exports = {build: build};
