/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Dependencies
const React = require("react");

// Shortcuts
const { div } = React.DOM;

/**
 * TODO: docs
 */
var PayloadTab = React.createClass({
/** @lends PayloadTab */

  displayName: "PayloadTab",

  render: function() {
    var frame = this.props.selection || {};
    return (
      div({className: "payloadTabContent"},
        frame.payload ? frame.payload : ""
      )
    );
  }
});

// Exports from this module
exports.PayloadTab = PayloadTab;
});
