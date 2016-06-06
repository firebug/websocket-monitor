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
   * Component responsible for rendering the SocketIO tab.
   */
  let SocketIOTab = React.createClass({
  /** @lends SocketIOTab */

    displayName: "SocketIOTab",

    render: function () {
      let selectedFrame = this.props.selection || {};
      let data = selectedFrame.socketIo;

      return (
        DIV({className: "details"},
          TreeView({key: "SocketIOTabTree", data: data})
        )
      );
    }
  });

  // Exports from this module
  exports.SocketIOTab = SocketIOTab;
});
