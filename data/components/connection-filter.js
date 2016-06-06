/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
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
  const ConnectionFilter = React.createClass({
  /** @lends ConnectionFilter */

    displayName: "ConnectionFilter",

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

    render() {
      const { uniqueConnections } = this.props.frames;
      const noFilterString =
        Locale.$STR("websocketmonitor.ConnectionFilter.NoFilter");

      return (
        uniqueConnections.length > 1 ?
          select({
            className: "ConnectionFilter",
            value: this.props.frames.filter.webSocketSerialID,
            onChange: this.handleChange
          }, option({ value: null }, noFilterString),
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

