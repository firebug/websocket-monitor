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
 * TODO: docs
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
