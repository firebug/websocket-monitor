/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
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
  let JSONTab = React.createClass({
  /** @lends JSONTab */

    displayName: "JSONTab",

    render: function () {
      let selectedFrame = this.props.selection || {};
      let data = selectedFrame.json;

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

