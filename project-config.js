//==============================================================================
// Project Configuration
//==============================================================================

// Input & output directories.
var OPTIONS = {
  rootSrcDir: 'src/',
  generatedCodeDir: 'gen/',
  tempFileDir: 'tmp/',
  outputDir: 'build/'
};


// List of root application LESS & CSS files (relative to rootSrcDir) and
// include directories (also relative to rootSrcDir) to resolve @import files
// from. Only need to include root files here; all files from @import will be
// included automatically. Can also contain glob wildcard patterns.
//
// CSS class names from these input files will be obfuscated and must be
// accessed with goog.getCssName() in JS and {css aClassName} in Soy.
//
// These files should NOT @import any 3rd party CSS from CSS_3P (though
// importing a 3rd party file that only includes LESS mixins--including no
// style definitions--is okay).
var CSS_APP = {
  inputFiles: ['ui/**/*.less'],
  includeDirs: ['.']
};


// List of root 3rd party CSS files (relative to this directory) and include
// directories to resolve @import files from. Only need to include root files
// here; all files from @import will be included automatically. Can also contain
// glob wildcard patterns.
//
// CSS class names will NOT be obfuscated for these files (so you can refer to
// them directly--don't use goog.getCssName() or {css} in Soy for class names).
var CSS_3P = {
  inputFiles: ['3p/bootstrap-3.0.0/less/bootstrap.less'],
  includeDirs: ['3p/bootstrap-3.0.0/less/']
};


// JavaScript modules, including application code and any 3rd party JS. Format
// documentation: http://github.com/Lindurion/closure-pro-build#required
var JS_MODULES = {
  page: {
    description: 'Server rendered initial HTML page, loads main JS and CSS',
    closureRootNamespaces: ['cbxrs.ui.page']
  },
  main: {
    description: 'Main JS module, with all client-side JS',
    closureRootNamespaces: ['cbxrs.ui.main']
  }
};


module.exports = {
  OPTIONS: OPTIONS,
  CSS_APP: CSS_APP,
  CSS_3P: CSS_3P,
  JS_MODULES: JS_MODULES
};
