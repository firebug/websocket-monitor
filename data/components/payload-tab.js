/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  // Dependencies
  const React = require("react");

  // Shortcuts
  const { div } = React.DOM;

  /**
   * This component represents Payload side panel and is responsible
   * for rendering frame's payload. It's displayed as a plain text.
   */
  let PayloadTab = React.createClass({
  /** @lends PayloadTab */

    displayName: "PayloadTab",

    render: function () {
      let frame = this.props.selection || {};
      let data = frame.data || {};

      return (
        div({className: "payloadTabContent"},
          data.payload ? data.payload : ""
        )
      );
    }
  });

  // Exports from this module
  exports.PayloadTab = PayloadTab;
});
