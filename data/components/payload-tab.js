/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Dependencies
const React = require("react");

// Shortcuts
const { div } = React.DOM;

/**
 * This component represents Payload side panel and is responsible
 * for rendering frame's payload. It's displayed as a plain text.
 */
var PayloadTab = React.createClass({
/** @lends PayloadTab */

  displayName: "PayloadTab",

  render: function() {
    var frame = this.props.selection || {};
    var data = frame.data || {};

    // Show parsed mqtt payload
    if (frame.mqtt) {
      data.payload = frame.mqtt.payload;
    }

    return (
      div({className: "payloadTabContent"},
        data.payload ? data.payload : ""
      )
    );
  }
});

// Exports from this module
exports.PayloadTab = PayloadTab;
});
