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

  /**
   * Render the top level application component.
   */
  initialize: function(config) {
    this.onAddFrames = this.onAddFrames.bind(this);

    // Render the top level application component.
    var content = document.getElementById("content");
    this.theApp = React.render(Provider({store: store},
      () => App(config)
    ), content);
  },

  // nsIWebSocketFrameService events

  /**
   * Event handlers are executed directly according to the
   * event types sent from the chrome scope.
   * See panel-view.js and panel-frame-script.js for details
   * about the mapping event -> method.
   */
  frameReceived: function(frame) {
    this.lazyAdd(JSON.parse(frame));
  },

  frameSent: function(frame) {
    this.lazyAdd(JSON.parse(frame));
  },

  lazyAdd: function(frame) {
    this.newFrames.push(frame);

    if (!this.timeout) {
      this.timeout = setTimeout(this.onAddFrames, 300);
    }
  },

  onAddFrames: function() {
    store.dispatch(addFrames(this.newFrames));

    this.newFrames = [];
    this.timeout = null;
  },

  // Search/Filter

  onSearch: function(filter) {
    store.dispatch(filterFrames(filter));
  }
});

// End of main.js
});
