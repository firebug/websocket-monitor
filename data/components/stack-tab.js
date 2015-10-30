/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Dependencies
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");
const { TreeView } = require("reps/tree-view");

// Shortcuts
const { div } = React.DOM;

/**
 * This component represents a Stack side panel that displays
 * stack frames for sent frames. This allows the user to find
 * out which line caused the action.
 *
 * xxxHonza: TBD
 */
var StackTab = React.createClass({
/** @lends StackTab */

  displayName: "StackTab",

  getInitialState: function() {
    return {
      selectedFrame: null
    };
  },

  render: function() {
    var selectedFrame = this.props.selectedFrame || {};

    return (
      div({className: "details"},
        TreeView({key: "packet-detail", data: selectedFrame})
      )
    );
  }
});

// Exports from this module
exports.StackTab = StackTab;
});
