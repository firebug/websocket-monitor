/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  // ReactJS
  const React = require("react");

  // Firebug.SDK
  const { createFactories } = require("reps/rep-utils");
  const { Tabs, TabPanel } = createFactories(require("reps/tabs"));

  // WebSockets Monitor
  const { DetailsTab } = createFactories(require("./details-tab"));
  const { PayloadTab } = createFactories(require("./payload-tab"));
  const { SocketIOTab } = createFactories(require("./socketio-tab"));
  const { SockJSTab } = createFactories(require("./sockjs-tab"));
  const { JSONTab } = createFactories(require("./json-tab"));
  const { WampTab } = createFactories(require("./wamp-tab"));
  const { MQTTTab } = createFactories(require("./mqtt-tab"));

  /**
   * @template This template represents a list of packets displayed
   * inside the panel content.
   */
  let Sidebar = React.createClass({
  /** @lends Sidebar */

    displayName: "Sidebar",

    getInitialState: function () {
      return {
        tabActive: 1,
      };
    },

    onTabChanged: function (index) {
      this.setState({tabActive: index});
    },

    render: function () {
      let tabActive = this.state.tabActive;
      let selectedFrame = this.props.selection || {};

      let tabs = [
        TabPanel({className: "details", key: "details",
          title: Locale.$STR("websocketmonitor.Details")},
          DetailsTab(this.props)
        ),
        TabPanel({className: "payload", key: "payload",
          title: Locale.$STR("websocketmonitor.Payload")},
          PayloadTab(this.props)
        )
      ];

      if (selectedFrame && selectedFrame.socketIo) {
        tabs.push(
          TabPanel({className: "socketio", key: "socketio",
            title: Locale.$STR("websocketmonitor.SocketIO")},
            SocketIOTab(this.props)
        ));
      }

      if (selectedFrame && selectedFrame.sockJs) {
        tabs.push(
          TabPanel({className: "sockjs", key: "sockjs",
            title: Locale.$STR("websocketmonitor.SockJS")},
            SockJSTab(this.props)
        ));
      }

      if (selectedFrame && selectedFrame.wamp) {
        tabs.push(
          TabPanel({className: "wamp", key: "wamp",
            title: Locale.$STR("websocketmonitor.WAMP")},
            WampTab(this.props)
        ));
      }

      if (selectedFrame && selectedFrame.json) {
        tabs.push(
          TabPanel({className: "json", key: "json",
            title: Locale.$STR("websocketmonitor.JSON")},
            JSONTab(this.props)
        ));
      }

      if (selectedFrame && selectedFrame.mqtt) {
        tabs.push(
          TabPanel({className: "mqtt", key: "mqtt",
            title: Locale.$STR("websocketmonitor.MQTT")},
            MQTTTab(this.props)
        ));
      }

      tabActive = Math.min(tabActive, tabs.length);

      return (
        Tabs({tabActive: tabActive, onAfterChange: this.onTabChanged}, tabs)
      );
    }
  });

  // Exports from this module
  exports.Sidebar = Sidebar;
});
