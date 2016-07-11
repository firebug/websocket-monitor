/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  // Dependencies
  const React = require("react");

  // Firebug SDK
  const { Str } = require("reps/core/string");
  const { TreeView } = require("reps/tree-view");
  const { createFactories } = require("reps/rep-utils");

  // WebSockets Monitor
  const { selectFrame } = require("../actions/selection");
  const { getOpCodeLabel } = require("./frame-utils");
  const { NoServiceWarning } = createFactories(require("./no-service-warning"));

  // Shortcuts
  const { div, span } = React.DOM;

  /**
   * @template This template represents a list of frames displayed
   * inside the frame bubble content.
   */
  const FrameList = React.createClass({
  /** @lends FrameList */

    displayName: "FrameList",

    getInitialState: function () {
      return { data: [] };
    },

    componentDidUpdate: function () {
      const bubble = document.querySelector(".frameBubble.selected");
      if (bubble) {
        this.ensureVisible(bubble);
      }
    },

    ensureVisible: function (bubble) {
      const content = document.querySelector(".mainPanelContent");

      if (bubble.offsetTop < content.scrollTop) {
        // minus padding
        content.scrollTop = bubble.offsetTop - 45;
      }

      const offset = bubble.offsetTop + bubble.offsetHeight;
      if (offset > content.scrollTop + content.clientHeight) {
        content.scrollTop = offset - content.clientHeight;
      }
    },

    getFrameTag: function (frame) {
      switch (frame.type) {
        case "event":
          return EventBubble;
        case "frame":
          return FrameBubble;
      }

      return null;
    },

    render: function () {
      let { frames, summary, filter } = this.props.frames;
      frames = filter.frames || frames;
      summary = filter.summary || summary;

      const output = [];

      // If the underlying nsIWebSocketEventService service isn't
      // available in the platform display a warning.
      if (!this.props.wsServiceAvailable) {
        output.push(NoServiceWarning({}));
      }

      // Render number of removed frames from the list if any.
      const removedFrames = summary.frameCount - frames.length;
      if (removedFrames > 0) {
        output.push(FrameLimit({
          key: "frame-limit",
          removedFrames: removedFrames
        }));
      }

      // Render all frames.
      for (let i in frames) {
        const frame = frames[i];
        output.push(this.getFrameTag(frame)({
          key: "frame-" + frame.id,
          frame: frame,
          selection: this.props.selection,
          dispatch: this.props.dispatch,
          config: this.props.config
        }));
      }

      // Render summary at the end (if there are any frames displayed).
      if (frames.length > 0) {
        output.push(FrameSummary({
          key: "frame-summary",
          summary: summary
        }));
      }

      return (
        div({className: "frameList"},
          div({}, output)
        )
      );
    }
  });

  /**
   * This template is responsible for rendering a frame with
   * related information. It looks like a chat message
   * bubble in standard chat UI applications.
   */
  const FrameBubble = React.createFactory(React.createClass({
  /** @lends FrameBubble */

    displayName: "FrameBubble",

    /**
     * Frames need to be re-rendered only if the selection changes.
     * This is an optimization that makes the list rendering a lot faster.
     */
    shouldComponentUpdate: function (nextProps, nextState) {
      return this.props.frame == nextProps.selection ||
        this.props.frame == this.props.selection;
    },

    // Event Handlers
    onClick: function (event) {
      const target = event.target;

      event.stopPropagation();
      event.preventDefault();

      // If a 'memberLabel' is clicked inside the inline preview
      // tree, let's process it by the tree, so expansion and
      // collapsing works. Otherwise just select the frame.
      if (!target.classList.contains("memberLabel")) {
        if (this.props.frame != this.props.selection) {
          this.props.dispatch(selectFrame(this.props.frame));
        }
      }
    },

    render: function () {
      const frame = this.props.frame;
      const data = frame.data;

      const type = frame.sent ? "send" : "receive";
      const size = Str.formatSize(data.payload ? data.payload.length : 0);
      const time = new Date(data.timeStamp / 1000);
      const timeText = time.getHours() + ":" + time.getMinutes() +
        ":" + time.getSeconds() + "." + time.getMilliseconds();
      let op = getOpCodeLabel(frame);
      let payload = Str.cropString(data.payload, 50);

      // Error frames have its own styling
      const classNames = ["frameBubble", type];
      if (frame.error) {
        classNames.push("error");
      }

      // Selected frames are highlighted
      if (this.props.selection == frame) {
        classNames.push("selected");
      }

      // Render inline frame preview. There is just one preview displayed
      let preview;

      if (this.props.config.enableSocketIo !== false && frame.socketIo) {
        preview = TreeView({
          key: "preview-socketio",
          // We only show the data that is deemed interesting for the user in
          // the inline previews, not the socketIO metadata
          data: {"Socket IO": frame.socketIo.data},
          mode: "tiny"
        });
      } else if (this.props.config.enableSockJs !== false && frame.sockJs) {
        preview = TreeView({
          key: "preview-sockjs",
          data: {"SockJS": frame.sockJs},
          mode: "tiny"
        });
      } else if (this.props.config.enableJson !== false && frame.json) {
        preview = TreeView({
          key: "preview-json",
          data: {"JSON": frame.json},
          mode: "tiny"
        });
      } else if (this.props.config.enableMqtt !== false && frame.mqtt) {
        const mqtt = frame.mqtt;
        op = "MQTT " + mqtt.cmd;

        if (mqtt.cmd === "publish") {
          payload = mqtt.topic;
        } else {
          payload = mqtt.messageId || mqtt.clientId || mqtt.returnCode;
        }

        preview = TreeView({
          key: "preview-mqtt",
          data: {"MQTT": mqtt},
          mode: "tiny"
        });
      } else if (this.props.config.enableQueryString !== false
                 && frame.queryString) {
        preview = TreeView({
          key: "preview-query",
          data: {"Query String": frame.queryString},
          mode: "tiny"
        });
      }

      const label = (type == "send") ?
        Locale.$STR("websocketmonitor.label.sent") :
        Locale.$STR("websocketmonitor.label.received");

      return (
        div({className: classNames.join(" "), onClick: this.onClick},
          div({className: "frameBox"},
            div({className: "frameContent"},
              div({className: "body"},
                span({className: "text"}, label),
                span({className: "type"}, op),
                div({className: "payload"}, payload),
                div({className: "preview"},
                  preview
                ),
                div({},
                  span({className: "info"}, timeText + ", " + size)
                )
              ),
              div({className: "boxArrow"})
            )
          )
        )
      );
    },
  }));

  /**
   * Template for WS events (connect and disconnect) displayed in the
   * frame list (list view)
   */
  let EventBubble = React.createFactory(React.createClass({
  /** @lends EventBubble */

    displayName: "EventBubble",

    /**
     * Frames need to be re-rendered only if the selection changes.
     * This is an optimization that makes the list rendering a lot faster.
     */
    shouldComponentUpdate: function (nextProps, nextState) {
      return this.props.frame == nextProps.selection ||
        this.props.frame == this.props.selection;
    },

    // Event Handlers

    onClick: function (event) {
      let target = event.target;

      event.stopPropagation();
      event.preventDefault();

      // If a 'memberLabel' is clicked inside the inline preview
      // tree, let's process it by the tree, so expansion and
      // collapsing works. Otherwise just select the frame.
      if (!target.classList.contains("memberLabel")) {
        if (this.props.frame != this.props.selection) {
          this.props.dispatch(selectFrame(this.props.frame));
        }
      }
    },

    render: function () {
      let frame = this.props.frame;

      // Frame classes
      let classNames = ["frameBubble", "eventBubble", frame.type];
      if (this.props.selection == frame) {
        classNames.push("selected");
      }

      let label = frame.uri ?
        Locale.$STR("websocketmonitor.event.connected") :
        Locale.$STR("websocketmonitor.event.disconnected");

      let uri = frame.uri ? frame.uri :
        Locale.$STR("websocketmonitor.event.code") + " " + frame.code;

      let socketIdLabel = Locale.$STR("websocketmonitor.SocketID") +
        ": " + frame.webSocketSerialID;

      return (
        div({className: classNames.join(" "), onClick: this.onClick},
          div({className: "frameBox"},
            div({className: "frameContent"},
              div({className: "body"},
                div({className: "text"}, label),
                div({className: "uri"}, uri),
                div({className: "socketId"}, socketIdLabel)
              )
            )
          )
        )
      );
    }
  }));

  /**
   * @template This template is responsible for rendering a message
   * at the top of the frame list that informs the user about reaching
   * the maximum limit of displayed frames. The message also displays
   * number of frames removed from the list.
   */
  let FrameLimit = React.createFactory(React.createClass({
  /** @lends FrameLimit */

    displayName: "FrameLimit",

    render: function () {
      let { removedFrames } = this.props;

      // Render summary info
      return (
        div({className: "frameLimit"},
          span({className: "text"},
            Locale.$STRP("websocketmonitor.limit.removedFrames",
                         [removedFrames])
          )
        )
      );
    }
  }));

  /**
   * @template This template is responsible for rendering frame summary
   * information. It displays number of sent and received packets
   * and total amount of sent and received data.
   */
  let FrameSummary = React.createFactory(React.createClass({
  /** @lends FrameSummary */

    displayName: "FrameSummary",

    render: function () {
      let { summary } = this.props;

      return (
        div({className: "frameSummary"},
          div({className: "text"},
            Locale.$STRP("websocketmonitor.summary.frameCount",
                         [summary.frameCount])
          ),
          div({className: "separator"}),
          div({className: "text"},
            Str.formatSize(summary.totalSize)
          ),
          div({className: "separator"}),
          div({className: "time"},
            Str.formatTime((summary.endTime - summary.startTime) / 1000)
          )
        )
      );
    }
  }));

  // Exports from this module
  exports.FrameList = FrameList;
});
