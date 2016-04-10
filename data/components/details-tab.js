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
 * This component represents Details side panel and is responsible
 * for rendering all properties of a frame as an expandable tree.
 */
var DetailsTab = React.createClass({
/** @lends DetailsTab */

  displayName: "DetailsTab",

  render: function() {
    var selectedFrame = this.props.selection || {};

    // Show parsed mqtt payload
    if (selectedFrame.mqtt) {
      selectedFrame.data.payload = selectedFrame.mqtt.payload;
    }

    return (
      DIV({className: "details"},
        TreeView({key: "detailsTabTree", data: selectedFrame.data})
      )
    );
  }
});

// Exports from this module
exports.DetailsTab = DetailsTab;
});
