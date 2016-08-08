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
   * Component responsible for rendering the Query String tab.
   */
  let QueryStringTab = React.createClass({
  /** @lends QueryStringTab */

    displayName: "QueryStringTab",

    render: function () {
      let selectedFrame = this.props.selection || {};
      let data = selectedFrame.queryString;

      return (
        DIV({className: "details"},
          TreeView({key: "QueryStringTabTree", data: data})
        )
      );
    }
  });

  // Exports from this module
  exports.QueryStringTab = QueryStringTab;
});

