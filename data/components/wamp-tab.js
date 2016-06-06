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
   * Component responsible for rendering the WAMP tab.
   */
  let WampTab = React.createClass({
  /** @lends WampTab */

    displayName: "WampTab",

    render: function () {
      let selectedFrame = this.props.selection || {};
      let data = selectedFrame.wamp;

      return (
        DIV({className: "details"},
          TreeView({key: "WampTabTree", data: data})
        )
      );
    }
  });

  // Exports from this module
  exports.WampTab = WampTab;
});

