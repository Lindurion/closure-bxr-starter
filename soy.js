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

var kew = require('kew');
var fs = require('fs');
var path = require('path');
var underscore = require('underscore');
var vm = require('vm');



/**
 * Renderer to load compiled Soy template JS files and render templates.
 * @param {string} rootFileDir Root directory to load template files from.
 * @param {!Object.<string, string>} templateNameToFile Object map from
 *     'my.soy.template.name' to 'file.js' (relative to rootFileDir).
 * @constructor
 */
function SoyRenderer(rootFileDir, templateNameToFile) {
  this.rootFileDir_ = rootFileDir;
  this.templateNameToFile_ = templateNameToFile;

  /** Map from template name to loaded template function. */
  this.loadedTemplates_ = {};
}


/**
 * Renders a Soy template with the given templateName asynchronously, calling
 * callbackFn with the rendered string on success.
 * @param {string} file The file to load the Soy template from.
 * @param {!Object} params Soy template params plus templateName param.
 * @param {function(Error, string=)} callbackFn
 */
SoyRenderer.prototype.render = function(file, params, callbackFn) {
  var templateName = params.templateName;
  if (!templateName) {
    throw new Error('Must specify a templateName param for SoyRenderer');
  }

  var fullFilePath = path.join(this.rootFileDir_,
      this.templateNameToFile_[templateName]);
  if (fullFilePath != file) {
    throw new Error('SoyRenderer was not configured to render ' + templateName +
        'from file ' + file);
  }

  var renderTemplate = function() {
    var templateFn = this.loadedTemplates_[templateName];
    callbackFn(null, templateFn(params));
  };

  this.maybeLoadFileFor_(templateName)
      .then(underscore.bind(renderTemplate, this))
      .fail(callbackFn);
};


/**
 * @param {string} templateName
 * @return {!Promise} Will complete succesfully if template is loaded.
 * @private
 */
SoyRenderer.prototype.maybeLoadFileFor_ = function(templateName) {
  if (this.loadedTemplates_[templateName]) {
    return kew.resolve(null);
  }

  // Need to load template from file.
  var file = this.templateNameToFile_[templateName];
  if (!file) {
    throw new Error('SoyRenderer: Unknown template ' + templateName);
  }
  return this.loadTemplatesFromFile_(file);
};


/**
 * @return {!Promise} Will complete successfully when file templates are loaded.
 * @private
 */
SoyRenderer.prototype.loadTemplatesFromFile_ = function(file) {
  // Get all template names we should load from this file.
  var templateNames = [];
  for (var templateName in this.templateNameToFile_) {
    if (this.templateNameToFile_[templateName] == file) {
      templateNames.push(templateName);
    }
  }

  // Read the file.
  // TODO: Switch to kew.nfcall() when next version of kew is pushed to npm.
  var promise = kew.defer();
  fs.readFile(path.join(this.rootFileDir_, file), 'utf8',
      promise.makeNodeResolver());
  return promise.then(underscore.bind(function(fileContent) {
    try {
      // Eval its JS, which must be done from a global context.
      var evalContext = vm.createContext({});
      vm.runInContext(fileContent, evalContext);

      // Pull out the template functions we need.
      templateNames.forEach(function(templateName) {
        this.saveTemplate_(templateName, evalContext);
      }, this);
    } catch (e) {
      throw new Error('Errors reading Soy from file ' + file + ': ' + e);
    }
  }, this));
};


/**
 * @param {string} templateName
 * @param {!Object} evalScope
 * @private
 */
SoyRenderer.prototype.saveTemplate_ = function(templateName, evalScope) {
  var parts = templateName.split('.');

  var currentObject = evalScope;
  parts.forEach(function(part) {
    if (!currentObject[part]) {
      throw new Error('No function found for Soy template ' + templateName);
    }
    currentObject = currentObject[part];
  });

  this.loadedTemplates_[templateName] = currentObject;
};


module.exports = {SoyRenderer: SoyRenderer};
