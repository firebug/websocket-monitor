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
const { Trace, TraceError, FBTrace } = require("firebug.sdk/lib/core/trace.js").get(module.id);
const { PanelOverlay } = require("firebug.sdk/lib/panel-overlay.js");
const { ToolbarButton } = require("firebug.sdk/lib/toolbar-button.js");
const { Dom } = require("firebug.sdk/lib/core/dom.js");

// Constants
const NETWORK_STYLES_URL = "chrome://websocketmonitor/skin/network.css";
const WS_PANEL_ID = "dev-panel-websocketmonitorgetfirebug-com-Web-Sockets";

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

    this.onNavigate = this.onNavigate.bind(this);
  },

  destroy: function() {
    PanelOverlay.prototype.destroy.apply(this, arguments);

    let win = this.getPanelWindow();
    removeSheet(win, NETWORK_STYLES_URL, "author");

    win.off("websocketmonitor:navigate", this.onNavigate);
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

    win.FBTrace = FBTrace;

    // Load a script into the Network panel content/frame. This script
    // is responsible for displaying clickable icon that can be used
    // for navigation to the WebSocket panel.
    let url = "chrome://websocketmonitor/content/network-content-script.js";
    Dom.loadScript(doc, url, event => {
      // Script loaded
    });

    win.on("websocketmonitor:navigate", this.onNavigate);
  },

  onReady: function(options) {
    PanelOverlay.prototype.onReady.apply(this, arguments);

    Trace.sysout("WsmNetworkOverlay.onReady;", options);
  },

  // Events

  /**
   * Sent from the 'network-content-script.js' module when the user
   * clicks on WebSocket icon.
   */
  onNavigate: function(requestId) {
    this.toolbox.selectTool(WS_PANEL_ID).then(() => {
      // xxxHonza: Pass the requestId to the panel, so it can be
      // highlighted in the list (there can be more WS connections).
    });
  },

  // Commands

  onWebSocketFilter: function() {
    // xxxHonza: TODO
  }
});

// Exports from this module
exports.WsmNetworkOverlay = WsmNetworkOverlay;
