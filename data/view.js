/* See license.txt for terms of usage */

"use strict";

/* The following implementation serves as a View (the V in MVC pattern) */

define(function (require) {
  // Firebug.SDK
  const { createFactories } = require("reps/rep-utils");
  const { PanelView, createView } = require("firebug.sdk/lib/panel-view");

  // ReactJS & Redux
  const ReactDOM = require("react-dom");

  const { Provider } = createFactories(require("react-redux"));

  // WebSockets Monitor
  const { App } = createFactories(require("./containers/app"));
  const { configureStore } = require("./store/configure-store");
  const { addFrames, filterFrames, clear } = require("./actions/frames");
  const { showTableView, showListView } = require("./actions/perspective");
  const { updateConfig } = require("./actions/config");

  /** Redux store, populated on view initialize */
  let store;

  /**
   * This object represents a view that is responsible for rendering
   * WebSockets panel content. The view is running inside panel's frame
   * with content scope privileges.
   *
   * Rendering logic is based on React and Redux.
   */
  createView(PanelView,
    /** @lends WebSocketsView */
    {
      // New frames are rendered asynchronously in batches.
      timeout: null,
      newFrames: [],

      // Every frame has assigned unique ID.
      uuid: 0,

      /**
       * Render the top level application component.
       */
      initialize: function (config) {
        this.onAddFrames = this.onAddFrames.bind(this);

        // Pass additional properties/callbacks down to
        // the hierarchy of React components.
        config.togglePause = this.onTogglePause.bind(this);

        // Render the top level application component.
        this.content = document.getElementById("content");

        // Initialize the redux store with user preferences
        store = configureStore({
          config: {
            enableSocketIo: Options.get("enableSocketIo"),
            enableSockJs: Options.get("enableSockJs"),
            enableJson: Options.get("enableJson"),
            enableMqtt: Options.get("enableMqtt"),
            enableQueryString: Options.get("enableQueryString"),
          }
        });

        // Render the app
        this.theApp = ReactDOM.render(Provider({store: store},
          App(config)
        ), this.content);
      },

      // Chrome Messages

      tabNavigated: function () {
        // Clear on reload, and force ID filter reset
        store.dispatch(clear({ resetIDfilter: true }));
      },

      // nsIWebSocketEventService events

      webSocketCreated: function (data) {
        data.type = "event";
        this.lazyAdd(data);
      },

      webSocketOpened: function (data) {
      },

      webSocketClosed: function (data) {
        data.type = "event";
        this.lazyAdd(data);
      },

      /**
       * Event handlers are executed directly according to the
       * event types sent from the chrome scope.
       * See panel-view.js and panel-frame-script.js for details
       * about the mapping event -> method.
       */
      frameReceived: function (frame) {
        try {
          frame = JSON.parse(decodeURIComponent(escape(frame)));
          frame.received = true;
          frame.type = "frame";
          frame.data.webSocketSerialID = frame.webSocketSerialID;
          this.lazyAdd(frame);
        } catch (err) {
          console.log(err);
        }
      },

      frameSent: function (frame) {
        try {
          frame = JSON.parse(decodeURIComponent(escape(frame)));
          frame.sent = true;
          frame.type = "frame";
          frame.data.webSocketSerialID = frame.webSocketSerialID;
          this.lazyAdd(frame);
        } catch (err) {
          console.log(err);
        }
      },

      lazyAdd: function (frame) {
        frame.id = ++this.uuid;

        this.newFrames.push(frame);

        if (!this.timeout) {
          this.timeout = setTimeout(this.onAddFrames, 300);
        }
      },

      onAddFrames: function () {
        // Support for auto-scroll to the bottom. If the vertical
        // scrollbar of the main panel content is at the bottom
        // keep it at the bottom after new frames are rendered.
        const node = this.content.querySelector(".mainPanelContent");
        const shouldScrollBottom = node.scrollTop == node.scrollTopMax;

        store.dispatch(addFrames(this.newFrames));

        // Scroll to the bottom if required.
        if (shouldScrollBottom) {
          node.scrollTop = node.scrollTopMax;
        }

        this.newFrames = [];
        this.timeout = null;
      },

      onTogglePause: function (paused) {
        this.postChromeMessage("togglePause", paused);
      },

      // Search/Filter

      onSearch: function (filter) {
        store.dispatch(filterFrames(filter));
      },

      // Preferences

      onPrefChanged: function (event) {
        const prefName = event.prefName;

        switch (prefName) {
          case "tabularView":

            // Update the way how frames are displayed.
            if (event.newValue) {
              store.dispatch(showTableView());
            } else {
              store.dispatch(showListView());
            }
            break;
          case "enableSocketIo":
          case "enableSockJs":
          case "enableJson":
          case "enableMqtt":

            // Place protocol toggle prefs into config store
            store.dispatch(updateConfig(prefName, event.newValue));
            break;
          default:
            break;
        }
      }
    }
  );

  // End of main.js
});
