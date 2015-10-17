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
 * Component responsible for rendering the JSON tab.
 */
var JSONTab = React.createClass({
/** @lends JSONTab */

  displayName: "JSONTab",

  render: function() {
    var selectedFrame = this.props.selection || {};
    var data = selectedFrame.json;

    return (
      DIV({className: "details"},
        TreeView({key: "JSONTabTree", data: data})
      )
    );
  }
});

// Exports from this module
exports.JSONTab = JSONTab;
});

