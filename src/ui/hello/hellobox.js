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
goog.require('goog.events.EventType');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * Hello world Closure component.
 * @param {string} letter The initial letter that stands for the thing.
 * @param {string} thing The thing to say hello to.
 * @param {string} learnMoreUrl To link to on learn more button press.
 * @constructor
 * @extends {goog.ui.Component}
 */
cbxrs.ui.hello.HelloBox = function(letter, thing, learnMoreUrl) {
  goog.base(this);

  /**
   * @type {string}
   * @private
   */
  this.letter_ = letter;

  /**
   * @type {string}
   * @private
   */
  this.thing_ = thing;

  /**
   * @type {string}
   * @private
   */
  this.learnMoreUrl_ = learnMoreUrl;
};
goog.inherits(cbxrs.ui.hello.HelloBox, goog.ui.Component);


/** @override */
cbxrs.ui.hello.HelloBox.prototype.createDom = function() {
  var params = {
    letter: this.letter_,
    thing: this.thing_
  };

  this.setElementInternal(goog.soy.renderAsElement(
      cbxrs.ui.hello.soy.hellobox.element, params));
};


/** @override */
cbxrs.ui.hello.HelloBox.prototype.enterDocument = function() {
  // Search for the .helloButton element located within this component.
  var buttonEl = this.getElementByClass(goog.getCssName('helloButton'));

  // Listen for button press.
  this.getHandler().listen(buttonEl, goog.events.EventType.CLICK,
      this.handleLearnMore_);
};


/** @private */
cbxrs.ui.hello.HelloBox.prototype.handleLearnMore_ = function() {
  // In this case, a simple <a> would have sufficed, but using a full-blown JS
  // event handler just for demo purposes.
  window.location.href = this.learnMoreUrl_;
};
