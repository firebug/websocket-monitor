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

  getInitialState() {
    return {
      uniqueConnections: []
    };
  },

  handleChange(e) {
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

  // When the platform API supports it, this should be replaced
  // with some API call listing only the current connections on
  // the page.
  componentWillReceiveProps({ frames }) {
    if (frames && Array.isArray(frames.frames)) {
      frames.frames.forEach(frame => {
        const { uniqueConnections } = this.state;
        if (!uniqueConnections.includes(frame.webSocketSerialID)) {
          this.setState({
            uniqueConnections: [...uniqueConnections, frame.webSocketSerialID]
          });
        }
      })
    }
  },

  render() {
    const { uniqueConnections } = this.state;
    return (
      uniqueConnections.length > 1 ?
        select({
          className: "ConnectionFilter",
          value: this.props.frames.filter.webSocketSerialID,
          onChange: this.handleChange
        }, option({ value: null }, Locale.$STR("websocketmonitor.ConnectionFilter.NoFilter")),
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

