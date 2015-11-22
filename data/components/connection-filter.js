/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Dependencies
const React = require("react");

// WebSockets Monitor
const { filterFrames } = require("../actions/frames");

// Shortcuts
const { span, select, option } = React.DOM;

/**
 * This component renders a select element when unique
 * webSocket connections > 1. Using this dropdown, the
 * user can select the connection ID they are interested
 * in seeing, and a reducer should filter out all other
 * connections.
 */
var ConnectionFilter = React.createClass({
/** @lends ConnectionFilter */

  displayName: "ConnectionFilter",

  handleChange: function(e) {
    const { value } = e.target;
    const currentFilter = this.props.frames.filter;

    // Dispatch new filter, merging with old filter to
    // retain text filter alongside this filter.
    this.props.dispatch(filterFrames(
      Object.assign({}, currentFilter, {
        webSocketSerialID: value !== null ? Number(value) : null
      })
    ));
  },

  render: function() {

    var uniqueConnections = [];
    this.props.frames.frames.forEach(frame => {
      if (!uniqueConnections.includes(frame.webSocketSerialID)) {
        uniqueConnections.push(frame.webSocketSerialID);
      }
    });

    return (
      uniqueConnections.length > 1 ?
        select({ className: 'ConnectionFilter', onChange: this.handleChange },
          option({ value: null }, Locale.$STR("websocketmonitor.ConnectionFilter.NoFilter")),
          uniqueConnections.map((id, i) => {
            return option({key: i, value: id}, id);
          })
        ) :
        // else, no-op
        span()
    );
  }
});

// Exports from this module
exports.ConnectionFilter = ConnectionFilter;
});

