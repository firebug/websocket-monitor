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

// Constants
const { table, thead, th, tbody, tr, td, tfoot, div } = React.DOM;

/**
 * This components implements the main table layout for list of frames.
 */
var FrameTable = React.createClass({
/** @lends FrameTable */

  displayName: "FrameTable",

  render: function() {
    var frames = this.props.frames.frames;
    var filter = this.props.frames.filter;

    // Filter messages in case of non empty 'filter.text'.
    // Only frames that have the filter text in the payload
    // should be displayed.
    if (filter.text) {
      frames = frames.filter(frame => {
        var data = frame.header ? frame.header : frame.maskBit;
        return data.payload.indexOf(filter.text) != -1;
      });
    }

    // Render list frames.
    var rows = frames.map(frame => FrameRow({
      selection: this.props.selection,
      frame: frame,
      dispatch: this.props.dispatch
    }));

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
        )/*,
        tfoot({className: "frameTFoot"},
          tr({},
            td({colSpan: 5}, "Summary: ")
          )
        )*/
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

  getOpCode: function() {
    var frame = this.props.frame;
    var data = frame.header ? frame.header : frame.maskBit;
    var opCode = parseInt(data.opCode, 10);

    switch (opCode) {
      case data.OPCODE_CONTINUATION:
        return "CONTINUATION";
      case data.OPCODE_TEXT:
        return "TEXT";
      case data.OPCODE_BINARY:
        return "BINARY";
      case data.OPCODE_CLOSE:
        return "CLOSE";
      case data.OPCODE_PING:
        return "PING";
      case data.OPCODE_PONG:
        return "PONG";
    }

    return "(unknown)";
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
    var onClick = this.onClick.bind(this);
    var time = new Date(data.timeStamp / 1000);
    var timeText = time.getHours() + ":" + time.getMinutes() +
      ":" + time.getSeconds() + "." + time.getMilliseconds();

    // Test support for inline previews
    /*if (frame.socketIo) {
      var data = { payload: frame.socketIo };
      payload = TreeView({key: "detailsTabTree", data: data})
    }*/

    return (
      tr({className: className, onClick: onClick},
        td({className: "direction"},
          div({title: tooltipText})
        ),
        td({className: "socketId"}, frame.webSocketSerialID),
        td({className: "payloadSize"}, size),
        td({className: "payload"}, payload),
        td({className: "opcode"}, this.getOpCode()),
        td({className: "bit"}, data.maskBit ? "true" : "false"),
        td({className: "bit"}, data.finBit ? "true" : "false"),
        td({className: "time"}, timeText)
      )
    );
  }
}));

// Exports from this module
exports.FrameTable = FrameTable;
});
