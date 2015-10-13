/* See license.txt for terms of usage */

"use strict";

module.metadata = {
  "stability": "stable"
};

// Add-on SDK
const { Cu, Ci } = require("chrome");
const { Class } = require("sdk/core/heritage");
const { loadSheet, removeSheet } = require("sdk/stylesheet/utils");

// Firebug SDK
const { Trace, TraceError } = require("firebug.sdk/lib/core/trace.js").get(module.id);
const { PanelOverlay } = require("firebug.sdk/lib/panel-overlay.js");
const { ToolbarButton } = require("firebug.sdk/lib/toolbar-button.js");

// WebSocket Monitor

// Constants
const NETWORK_STYLES_URL = "chrome://websocketmonitor/skin/network.css";

/**
 * @overlay This object represents an overlay for the existing
 * Network panel. It's responsible for displaying an icon that
 * indicates WebSockets 'upgrade' HTTP requests.
 *
 * More details:
 * 1) The icon serves also as a link into the 'Web Sockets' panel.
 * 2) There is also a new filter that allows to see only
 *    WebSocket 'upgrade' HTTP requests.
 */
const WsmNetworkOverlay = Class(
/** @lends WsmNetworkOverlay */
{
  extends: PanelOverlay,

  overlayId: "webSocketsWsmNetworkOverlay",
  panelId: "netmonitor",

  // Initialization

  initialize: function(options) {
    PanelOverlay.prototype.initialize.apply(this, arguments);
  },

  destroy: function() {
    PanelOverlay.prototype.destroy.apply(this, arguments);

    let win = this.getPanelWindow();
    removeSheet(win, NETWORK_STYLES_URL, "author");
  },

  // Events

  onBuild: function(options) {
    PanelOverlay.prototype.onBuild.apply(this, arguments);

    Trace.sysout("WsmNetworkOverlay.onBuild;", options);

    let doc = this.getPanelDocument();
    let footer = doc.querySelector("#requests-menu-footer");
    let otherFilterButton = footer.querySelector("#requests-menu-filter-other-button");

    let button = new ToolbarButton({
      id: "requests-menu-filter-ws-button",
      "class": "requests-menu-filter-button requests-menu-footer-button",
      toolbar: footer,
      "_data-key": "ws",
      checked: false,
      referenceElement: otherFilterButton.nextSibling,
      label: "webSockets.network.filter.label",
      tooltiptext: "webSockets.network.filter.tip",
      command: this.onWebSocketFilter.bind(this)
    });

    // Load custom style-sheet into the panel window (content window of
    // the panel's frame). We need styles for the WS icon/link.
    let win = this.getPanelWindow();
    loadSheet(win, NETWORK_STYLES_URL, "author");
  },

  onReady: function(options) {
    PanelOverlay.prototype.onReady.apply(this, arguments);

    Trace.sysout("WsmNetworkOverlay.onReady;", options);
  },

  // Commands

  onWebSocketFilter: function() {
    // xxxHonza: TODO
  }
});

// Exports from this module
exports.WsmNetworkOverlay = WsmNetworkOverlay;
