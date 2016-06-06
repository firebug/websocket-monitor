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
   * Component responsible for rendering the MQTT tab.
   */
  let MQTTTab = React.createClass({
  /** @lends MQTTTab */

    displayName: "MQTTTab",

    render: function () {
      let selectedFrame = this.props.selection || {};
      let data = selectedFrame.mqtt;

      return (
        DIV({className: "details"},
          TreeView({key: "MQTTTabTree", data: data})
        )
      );
    }
  });

  // Exports from this module
  exports.MQTTTab = MQTTTab;
});

