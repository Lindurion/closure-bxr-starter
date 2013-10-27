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
var projectConfig = require('./project-config.js');
var recess = require('recess');
var underscore = require('underscore');


/**
 * Compiles inputFiles using RECESS and writes to outputFile.
 * @param {!Array.<string>} inputFiles
 * @param {!Array.<string>} includeDirs
 * @param {!{debug: boolean, lintMode: (boolean|undefined)}} options
 * @param {?string} outputFile (May be null for lintMode).
 * @return {!Promise} Tracks success/failure of LESS compilation.
 */
function build(inputFiles, includeDirs, options, outputFile) {
  return resolveLessInputFiles(inputFiles)
      .then(function(resolvedInputFiles) {
        return compile(resolvedInputFiles, includeDirs, options);
      })
      .then(underscore.partial(outputCssOrLintResults, options, outputFile))
      .fail(function(e) {
        throw new Error('Had errors building LESS/CSS:\n' + JSON.stringify(e));
      });
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
 * @param {!{debug: boolean, lintMode: (boolean|undefined)}} options
 * @return {!Promise} Yields RECESS compiled results on success.
 */
function compile(inputFiles, includeDirs, options) {
  var recessOptions = {
    compile: !options.lintMode,
    compress: !options.debug,
    includePath: includeDirs,
    prefixWhitespace: false
  };
  underscore.extend(recessOptions, projectConfig.CUSTOM_RECESS_OPTIONS);

  // TODO: Switch to kew.nfcall() when next version of kew is pushed to npm.
  var promise = kew.defer();
  recess(inputFiles, recessOptions, promise.makeNodeResolver());
  return promise;
}


/**
 * @param {!{debug: boolean, lintMode: (boolean|undefined)}} options
 * @param {?string} outputFile (May be null for lintMode).
 * @param {!Array.<!RECESS>} compiledResults
 * @return {!Promise} Tracks success/failure.
 */
function outputCssOrLintResults(options, outputFile, compiledResults) {
  if (options.lintMode) {
    return outputLintResults(compiledResults);
  }

  // TODO: Switch to kew.nfcall() when next version of kew is pushed to npm.
  var promise = kew.defer();
  fs.writeFile(outputFile, getCssAsString(compiledResults),
      promise.makeNodeResolver());
  return promise;
}


/**
 * @param {!Array.<!RECESS>} compiledResults
 * @return {!Promise} Tracks success/failure.
 */
function outputLintResults(compiledResults) {
  var hadWarningsOrErrors = false;
  compiledResults.forEach(function(fileResults) {
    if (fileResults.errors && (fileResults.errors.length > 0)) {
      hadWarningsOrErrors = true;
      console.error(fileResults.path + ' had CSS/LESS compilation errors:');
      console.error(fileResults.errors.join('\n'));
    }
    if (fileResults.output && (fileResults.output.length > 0)) {
      // TODO: Would be nice if RECESS indicated lint success in its API result.
      // This is a bit fragile.
      var fileOutput = fileResults.output.join('\n');
      if (fileOutput.indexOf('Perfect!') < 0) {
        hadWarningsOrErrors = true;
        console.error(fileOutput);
      }
    }
  });

  if (hadWarningsOrErrors) {
    return kew.reject(new Error('Had CSS/LESS issues'));
  } else {
    return kew.resolve(null);
  }
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
