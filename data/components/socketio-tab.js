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
 * TODO: docs
 */
var SocketIOTab = React.createClass({
/** @lends SocketIOTab */

  displayName: "SocketIOTab",

  render: function() {
    var selectedFrame = this.props.selection || {};
    var data = selectedFrame.socketIo;

    return (
      DIV({className: "details"},
        TreeView({key: "SocketIOTabTree", data: data})
      )
    );
  }
});

// Exports from this module
exports.SocketIOTab = SocketIOTab;
});
