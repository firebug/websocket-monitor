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
 * TODO
 */
var ConnectionFilter = React.createClass({
/** @lends ConnectionFilter */

  displayName: "ConnectionFilter",

  handleChange: function(e) {
    const { value } = e.target;
    const currentFilter = this.props.frames.filter;

    this.props.dispatch(filterFrames(
      Object.assign({}, currentFilter, {
        webSocketSerialID: Number(value)
      })
    ));
  },

  render: function() {

    var uniqueConnections = [];
    this.props.frames.frames.forEach(function(frame) {
      if (!uniqueConnections.includes(frame.webSocketSerialID)) {
        uniqueConnections.push(frame.webSocketSerialID);
      }
    });

    return (
      uniqueConnections.length > 1 ?
        select({ onChange: this.handleChange },
          option(Locale.$STR("websocketmonitor.ConnectionFilter.NoFilter")),
          uniqueConnections.map(function(id, i) {
            return option({key: i, value: id}, id);
          })
        ) :
        span()
    );
  }
});

// Exports from this module
exports.ConnectionFilter = ConnectionFilter;
});

