/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  // Dependencies
  const React = require("react");

  // Firebug SDK
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
  let StackTab = React.createClass({
  /** @lends StackTab */

    displayName: "StackTab",

    getInitialState: function () {
      return {
        selectedFrame: null
      };
    },

    render: function () {
      let selectedFrame = this.props.selectedFrame || {};

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
