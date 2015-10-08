/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// ReactJS
const React = require("react");

// Firebug SDK
const { Str } = require("reps/core/string");
const { TreeView } = require("reps/tree-view");

// WebSockets Monitor
const { selectFrame } = require("../actions/selection");
const { getOpCodeLabel } = require("./frame-utils");

// Constants
const { table, thead, th, tbody, tr, td, tfoot, div, span, code, a } = React.DOM;

/**
 * This components implements the main table layout for list of frames.
 */
var FrameTable = React.createClass({
/** @lends FrameTable */

  displayName: "FrameTable",

  render: function() {
    var {frames, summary, filter} = this.props.frames;

    frames = filter.frames || frames;

    // Render list of frames.
    var rows = frames.map(frame => FrameRow({
      selection: this.props.selection,
      frame: frame,
      dispatch: this.props.dispatch
    }));

    // Render summary info
    var tableFooter;
    if (summary.frameCount) {
      tableFooter = tfoot({className: "frameTFoot"},
        tr({},
          td({colSpan: 8},
            span({}, Locale.$STRP("websocketmonitor.summary.frameCount", [summary.frameCount])),
            span({}, Str.formatSize(summary.totalSize)),
            span({}, Str.formatTime((summary.endTime - summary.startTime) / 1000))
          )
        )
      )
    }

    // If the underlying nsIWebSocketFrameService service isn't
    // available in the platform display a warning.
    if (!this.props.frameServiceAvailable) {
      rows = [WarningRow()];
    }

    return (
      table({className: "frameTable"},
        thead({className: "frameTHead"},
          tr({},
            th({className: "direction"}),
            th({className: "socketId"}, Locale.$STR("websocketmonitor.SocketID")),
            th({className: "payloadSize"}, Locale.$STR("websocketmonitor.Size")),
            th({className: "payload"}, Locale.$STR("websocketmonitor.Payload")),
            th({className: "opcode"}, Locale.$STR("websocketmonitor.OpCode")),
            th({className: "bit"}, Locale.$STR("websocketmonitor.MaskBit")),
            th({className: "bit"}, Locale.$STR("websocketmonitor.FinBit")),
            th({className: "time"}, Locale.$STR("websocketmonitor.Time"))
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
var FrameRow = React.createFactory(React.createClass({
/** @lends FrameRow */

  displayName: "FrameRow",

  onClick: function() {
    if (this.props.frame != this.props.selection) {
      this.props.dispatch(selectFrame(this.props.frame));
    }
  },

  render: function() {
    var frame = this.props.frame;
    var data = frame.header ? frame.header : frame.maskBit;
    var className = "frameRow " + (frame.header ? "send" : "receive");
    var tooltipText = frame.header ? "Sent" : "Received";

    if (this.props.selection == frame) {
      className += " selected";
    }

    var payload = Str.cropString(data.payload, 50);
    var size = Str.formatSize(data.payload.length);
    var time = new Date(data.timeStamp / 1000);
    var timeText = time.getHours() + ":" + time.getMinutes() +
      ":" + time.getSeconds() + "." + time.getMilliseconds();

    // Test support for inline previews
    /*if (frame.socketIo) {
      var data = { payload: frame.socketIo };
      payload = TreeView({key: "detailsTabTree", data: data})
    }*/

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
 * Used to display a warning if "@mozilla.org/websocketframe/service;1"
 * needed by this extension isn't available on the platform.
 */
var WarningRow = React.createFactory(React.createClass({
/** @lends WarningRow */

  displayName: "WarningRow",

  render: function() {
    var text = "Your Firefox doesn't support ";
    return (
      tr({},
        td({colSpan: 8, className: "warningRow"},
          span({}, "Your Firefox doesn't support "),
          code({}, "@mozilla.org/websocketframe/service;1"),
          span({}, " component that is required by this extension. " +
            "You need to install newer Firefox version. If you are unsure " +
            "what to do you might want see the "),
          a({className: "bugLink", target: "_blank",
            href: "https://github.com/firebug/websocket-monitor/wiki"},
            "home page"
          ),
          span({}, ".")
        )
      )
    );
  }
}));

// Exports from this module
exports.FrameTable = FrameTable;
});
