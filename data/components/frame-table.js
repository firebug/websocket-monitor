/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  // ReactJS
  const React = require("react");

  // Firebug SDK
  const { Str } = require("reps/core/string");
  const { TreeView } = require("reps/tree-view");
  const { createFactories } = require("reps/rep-utils");

  // WebSockets Monitor
  const { selectFrame } = require("../actions/selection");
  const { getOpCodeLabel } = require("./frame-utils");
  const { NoServiceWarning } = createFactories(require("./no-service-warning"));

  // Constants
  const { table, thead, th, tbody, tr, td, tfoot, div, span } = React.DOM;

  /**
   * This components implements the main table layout for list of frames.
   */
  let FrameTable = React.createClass({
  /** @lends FrameTable */

    displayName: "FrameTable",

    componentDidUpdate: function () {
      let row = document.querySelector(".frameRow.selected");
      if (row) {
        this.ensureVisible(row);
      }
    },

    ensureVisible: function (row) {
      let content = document.querySelector(".mainPanelContent");

      if (row.offsetTop < content.scrollTop) {
        content.scrollTop = row.offsetTop;
      }

      const rowOffset = row.offsetTop + row.offsetHeight;
      if (rowOffset > content.scrollTop + content.clientHeight) {
        content.scrollTop = rowOffset - content.clientHeight;
      }
    },

    getFrameTag: function (frame) {
      switch (frame.type) {
        case "event":
          return EventRow;
        case "frame":
          return FrameRow;
      }

      return null;
    },

    render: function () {
      let {frames, summary, filter} = this.props.frames;
      frames = filter.frames || frames;
      summary = filter.summary || summary;

      // Render list of frames.
      let rows = frames.map(frame => this.getFrameTag(frame)({
        key: frame.id,
        selection: this.props.selection,
        frame: frame,
        dispatch: this.props.dispatch,
        config: this.props.config
      }));

      // Render summary info
      let tableFooter;
      if (summary.frameCount) {
        tableFooter = tfoot({className: "frameTFoot"},
          tr({},
            td({colSpan: 8},
              span({}, Locale.$STRP("websocketmonitor.summary.frameCount", [
                summary.frameCount])),
              span({}, Str.formatSize(summary.totalSize)),
              span({},
                   Str.formatTime((summary.endTime - summary.startTime) / 1000))
            )
          )
        );
      }

      // If the underlying nsIWebSocketEventService service isn't
      // available in the platform display a warning.
      if (!this.props.wsServiceAvailable) {
        rows = [WarningRow()];
      }

      return (
        table({className: "frameTable"},
          thead({className: "frameTHead"},
            tr({},
              th({className: "direction"}),
              th({className: "socketId"},
                 Locale.$STR("websocketmonitor.SocketID")
                ),
              th({className: "payloadSize"},
                 Locale.$STR("websocketmonitor.Size")
                ),
              th({className: "payload"},
                 Locale.$STR("websocketmonitor.Payload")
                ),
              th({className: "opcode"},
                 Locale.$STR("websocketmonitor.OpCode")
                ),
              th({className: "bit"},
                 Locale.$STR("websocketmonitor.MaskBit")
                ),
              th({className: "bit"},
                 Locale.$STR("websocketmonitor.FinBit")
                ),
              th({className: "time"},
                 Locale.$STR("websocketmonitor.Time")
                )
            )
          ),
          tbody({className: "frameTBody"},
            rows
          ),
          tableFooter
        )
      );
    }

  });

  /**
   * Represents a row within the frame list.
   */
  let FrameRow = React.createFactory(React.createClass({
  /** @lends FrameRow */

    displayName: "FrameRow",

    getInitialState() {
      return {};
    },

    /**
     * Create TreeView sub-components in lifecycle methods so we
     * only generate them once and don't run into state issues
     * with the TreeView component.
     */
    componentWillMount() {
      if (this.props.frame) {
        this.setState({ payload: this.buildPayload(this.props.frame) });
      }
    },

    /**
     * Create TreeView sub-components in lifecycle methods so we
     * only generate them once and don't run into state issues
     * with the TreeView component.
     */
    componentWillReceiveProps({ frame }) {
      if (frame !== this.props.frame) {
        this.setState({ payload: this.buildPayload(this.props.frame) });
      }
    },

    /**
     * Frames need to be re-rendered only if the selection changes.
     * This is an optimization that makes the list rendering a lot faster.
     */
    shouldComponentUpdate: function (nextProps, nextState) {
      return nextProps.selection !== this.props.selection && (
        this.props.frame == nextProps.selection ||
        this.props.frame == this.props.selection);
    },

    onClick: function () {
      if (this.props.frame != this.props.selection) {
        this.props.dispatch(selectFrame(this.props.frame));
      }
    },

    buildPayload(frame) {
      let payload;

      // Test support for inline previews.
      if (this.props.config.enableSocketIo !== false && frame.socketIo) {
        payload = TreeView({
          key: "preview-socketio",
          // We only show the data that is deemed interesting for the user in
          // the inline previews, not the socketIO metadata
          data: {"Socket IO": frame.socketIo.data},
        });
      } else if (this.props.config.enableSockJs !== false && frame.sockJs) {
        payload = TreeView({
          key: "preview-sockjs",
          data: {"SockJS": frame.sockJs},
        });
      } else if (this.props.config.enableJson !== false && frame.json) {
        payload = TreeView({
          key: "preview-json",
          data: {"JSON": frame.json},
        });
      } else if (this.props.config.enableMqtt !== false && frame.mqtt) {
        payload = TreeView({
          key: "preview-mqtt",
          data: {"MQTT": frame.mqtt},
        });
      } else if (this.props.config.enableQueryString !== false
                 && frame.queryString) {
        payload = TreeView({
          key: "preview-query",
          data: {"Query String": frame.queryString},
        });
      } else {
        // Fall back to showing a string
        payload = Str.cropString(frame.data.payload, 50);
      }
      return payload;
    },

    render: function () {
      let frame = this.props.frame;
      let payload = this.state.payload;
      let data = frame.data;

      let className = "frameRow " + (frame.sent ? "send" : "receive");
      let tooltipText = frame.sent ? "Sent" : "Received";

      if (this.props.selection == frame) {
        className += " selected";
      }

      let size = Str.formatSize(data.payload ? data.payload.length : 0);
      let time = new Date(data.timeStamp / 1000);
      let timeText = time.getHours() + ":" + time.getMinutes() +
        ":" + time.getSeconds() + "." + time.getMilliseconds();

      return (
        tr({className: className, onClick: this.onClick},
          td({className: "direction"},
            div({title: tooltipText})
          ),
          td({className: "socketId"}, frame.webSocketSerialID),
          td({className: "payloadSize"}, size),
          td({className: "payload"}, payload),
          td({className: "opcode"}, getOpCodeLabel(frame)),
          td({className: "bit"}, data.maskBit ? "true" : "false"),
          td({className: "bit"}, data.finBit ? "true" : "false"),
          td({className: "time"}, timeText)
        )
      );
    }
  }));

  /**
   * Template for WS events (connect and disconnect) displayed in the
   * frame list (table view)
   */
  let EventRow = React.createFactory(React.createClass({
  /** @lends FrameRow */

    displayName: "EventRow",

    /**
     * Frames need to be re-rendered only if the selection changes.
     * This is an optimization that makes the list rendering a lot faster.
     */
    shouldComponentUpdate: function (nextProps, nextState) {
      return this.props.frame == nextProps.selection ||
        this.props.frame == this.props.selection;
    },

    onClick: function () {
      if (this.props.frame != this.props.selection) {
        this.props.dispatch(selectFrame(this.props.frame));
      }
    },

    render: function () {
      let frame = this.props.frame;
      let className = "frameRow eventRow";

      if (this.props.selection == frame) {
        className += " selected";
      }

      let label = frame.uri ?
        Locale.$STR("websocketmonitor.event.connected") :
        Locale.$STR("websocketmonitor.event.disconnected");

      let uri = frame.uri ? frame.uri :
        Locale.$STR("websocketmonitor.event.code") + " " + frame.code;

      return (
        tr({className: className, onClick: this.onClick},
          td({className: "direction"}),
          td({className: "socketId"},
            frame.webSocketSerialID
          ),
          td({className: "", colSpan: 6},
            span({className: "text"}, label),
            span({className: "uri"}, uri)
          )
        )
      );
    }
  }));

  /**
   * Used to display a warning if "@mozilla.org/websocketevent/service;1"
   * needed by this extension isn't available on the platform.
   */
  let WarningRow = React.createFactory(React.createClass({
  /** @lends WarningRow */

    displayName: "WarningRow",

    render: function () {
      return (
        tr({},
          td({colSpan: 8},
            NoServiceWarning({})
          )
        )
      );
    }
  }));

  // Exports from this module
  exports.FrameTable = FrameTable;
});
