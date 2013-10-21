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

goog.provide('cbxrs.ui.hello.HelloBox');

goog.require('cbxrs.ui.hello.soy.hellobox');
goog.require('goog.soy');
goog.require('goog.ui.Component');


/**
 * Hello world Closure component.
 * @param {string} thing The thing to say hello to.
 * @constructor
 * @extends {goog.ui.Component}
 */
cbxrs.ui.hello.HelloBox = function(thing) {
  goog.base(this);

  /** @private {string} */
  this.thing_ = thing;
};
goog.inherits(cbxrs.ui.hello.HelloBox, goog.ui.Component);


/** @override */
cbxrs.ui.hello.HelloBox.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      cbxrs.ui.hello.soy.hellobox.element, {thing: this.thing_}));
};


// TODO: Add click event handling for something...
