/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Dependencies
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");
const { TreeView } = require("reps/tree-view");

// Shortcuts
const { DIV } = Reps.DOM;

/**
 * Component responsible for rendering the WAMP tab.
 */
var WampTab = React.createClass({
/** @lends WampTab */

  displayName: "WampTab",

  render: function() {
    var selectedFrame = this.props.selection || {};
    var data = selectedFrame.wamp;

    return (
      DIV({className: "details"},
        TreeView({key: "WampTabTree", data: data})
      )
    );
  }
});

// Exports from this module
exports.WampTab = WampTab;
});

