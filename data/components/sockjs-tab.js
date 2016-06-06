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
   * Component responsible for rendering the SockJS tab.
   */
  let SockJSTab = React.createClass({
  /** @lends SockJSTab */

    displayName: "SockJSTab",

    render: function () {
      let selectedFrame = this.props.selection || {};
      let data = selectedFrame.sockJs;

      return (
        DIV({className: "details"},
          TreeView({key: "SockJSTabTree", data: data})
        )
      );
    }
  });

  // Exports from this module
  exports.SockJSTab = SockJSTab;
});

