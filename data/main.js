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
const { addFrames } = require("./actions/frames");

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
  initialize: function() {
    this.onFrameReceived = this.onFrameReceived.bind(this);
    this.onFrameSent = this.onFrameSent.bind(this);
    this.onAddFrames = this.onAddFrames.bind(this);

    addEventListener("frameReceived", this.onFrameReceived);
    addEventListener("frameSent", this.onFrameSent);

    var content = document.getElementById("content");
    var theApp = React.render(Provider({store: store},
      () => App({})
    ), content);
  },

  // nsIWebSocketFrameService events

  onFrameReceived: function(event) {
    this.lazyAdd(JSON.parse(event.data));
  },

  onFrameSent: function(event) {
    this.lazyAdd(JSON.parse(event.data));
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
  }
});

// End of main.js
});
