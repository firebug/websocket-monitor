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
 * Component responsible for rendering the SockJS tab.
 */
var SockJSTab = React.createClass({
/** @lends SockJSTab */

  displayName: "SockJSTab",

  render: function() {
    var selectedFrame = this.props.selection || {};
    var data = selectedFrame.sockJs;

    return (
      DIV({className: "details"},
        TreeView({key: "SockJSTabTree", data: data})
      )
    );
  }
});

// Exports from this module
exports.SockJSTab = SockJSTab;
});

