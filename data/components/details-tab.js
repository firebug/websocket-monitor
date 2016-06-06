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
   * This component represents Details side panel and is responsible
   * for rendering all properties of a frame as an expandable tree.
   */
  const DetailsTab = React.createClass({
  /** @lends DetailsTab */

    displayName: "DetailsTab",

    render: function () {
      const selectedFrame = this.props.selection || {};

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
