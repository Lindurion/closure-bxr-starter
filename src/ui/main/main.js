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

goog.provide('cbxrs.ui.main');

goog.require('cbxrs.ui.hello.HelloBox');
goog.require('goog.dom');


/** Client-side JS application entry point. */
cbxrs.ui.main = function() {
  var contentEl = goog.dom.getElement('contentArea');

  // Note: The components below are client-side rendered just for demo purposes.
  // Since all data is static and known in advance, they could easily be server-
  // side rendered in this case.

  /** @desc One letter abbreviation for Bootstrap. */
  var MSG_BOOTSTRAP_INITIAL = goog.getMsg('b');

  /** @desc Bootstrap CSS responsive design framework. */
  var MSG_BOOTSTRAP = goog.getMsg('Bootstrap');

  var bootstrapHelloBox = new cbxrs.ui.hello.HelloBox(
      MSG_BOOTSTRAP_INITIAL, MSG_BOOTSTRAP, 'http://getbootstrap.com');
  bootstrapHelloBox.render(contentEl);

  /** @desc One letter abbreviation for Express. */
  var MSG_EXPRESS_INITIAL = goog.getMsg('x');

  /** @desc Express, the node.js server framework. */
  var MSG_EXPRESS = goog.getMsg('Express');

  var expressHelloBox = new cbxrs.ui.hello.HelloBox(
      MSG_EXPRESS_INITIAL, MSG_EXPRESS, 'http://expressjs.com');
  expressHelloBox.render(contentEl);

  /** @desc One letter abbreviation for RECESS. */
  var MSG_RECESS_INITIAL = goog.getMsg('r');

  /** @desc RECESS, the LESS/CSS compiler and code linter. */
  var MSG_RECESS = goog.getMsg('RECESS');

  var recessHelloBox = new cbxrs.ui.hello.HelloBox(
      MSG_RECESS_INITIAL, MSG_RECESS, 'http://twitter.github.io/recess');
  recessHelloBox.render(contentEl);
};


cbxrs.ui.main();
