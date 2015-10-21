/* See license.txt for terms of usage */

/* The following implementation serves as a View (the V in MVC pattern) */

define(function(require/*, exports, module*/) {

"use strict";

// Firebug.SDK
const { createFactories } = require("reps/rep-utils");
const { PanelView, createView } = require("firebug.sdk/lib/panel-view");

// ReactJS & Redux
const React = require("react");
const { Provider } = createFactories(require("react-redux"));

// WebSockets Monitor
const { App } = createFactories(require("./containers/app"));
const { configureStore } = require("./store/configure-store");
const { addFrames, filterFrames } = require("./actions/frames");
const { showTableView, showListView } = require("./actions/perspective");

var store = configureStore();

/**
 * This object represents a view that is responsible for rendering
 * Toolbox panel's content. The view is running inside panel's frame
 * and so, within content scope with no extra privileges.
 *
 * Rendering is done through standard web technologies like e.g.
 * React and Redux.
 */
var WebSocketsView = createView(PanelView,
/** @lends WebSocketsView */
{
  /**
   * New frames are rendered asynchronously in batches.
   */
  timeout: null,
  newFrames: [],
  uuid: 0,

  /**
   * Render the top level application component.
   */
  initialize: function(config) {
    this.onAddFrames = this.onAddFrames.bind(this);

    // Render the top level application component.
    this.content = document.getElementById("content");
    this.theApp = React.render(Provider({store: store},
      App(config)
    ), this.content);
  },

  // nsIWebSocketService events

  /**
   * Event handlers are executed directly according to the
   * event types sent from the chrome scope.
   * See panel-view.js and panel-frame-script.js for details
   * about the mapping event -> method.
   */
  frameReceived: function(frame) {
    frame = JSON.parse(frame);
    frame.received = true;
    this.lazyAdd(frame);
  },

  frameSent: function(frame) {
    frame = JSON.parse(frame);
    frame.sent = true;
    this.lazyAdd(frame);
  },

  lazyAdd: function(frame) {
    frame.id = ++this.uuid;

    this.newFrames.push(frame);

    if (!this.timeout) {
      this.timeout = setTimeout(this.onAddFrames, 300);
    }
  },

  onAddFrames: function() {
    // Support for auto-scroll to the bottom. If the vertical
    // scrollbar of the main panel content is at the bottom
    // keep it at the bottom after new frames are rendered.
    var node = this.content.querySelector(".mainPanelContent");
    var shouldScrollBottom = node.scrollTop == node.scrollTopMax;

    store.dispatch(addFrames(this.newFrames));

    // Scroll to the bottom if required.
    if (shouldScrollBottom) {
      node.scrollTop = node.scrollTopMax;
    }

    this.newFrames = [];
    this.timeout = null;
  },

  // Search/Filter

  onSearch: function(filter) {
    store.dispatch(filterFrames(filter));
  },

  // Preferences

  onPrefChanged: function(event) {
    var prefName = event.prefName;
    if (prefName != "tabularView") {
      return;
    }

    // Update the way how frames are displayed.
    if (event.newValue) {
      store.dispatch(showTableView());
    } else {
      store.dispatch(showListView());
    }
  }
});

// End of main.js
});
