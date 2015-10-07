/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Dependencies
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/reps");
const { Str } = require("reps/core/string");
const { TreeView } = require("reps/tree-view");

// Shortcuts
const { div, span } = React.DOM;

/**
 * @template This template represents a list of frames displayed
 * inside the frame bubble content.
 */
var FrameList = React.createClass({
/** @lends FrameList */

  displayName: "FrameList",

  getInitialState: function() {
    return { data: [] };
  },

  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.shouldScrollBottom = node.scrollTop +
      node.offsetHeight === node.scrollHeight;
  },

  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.getDOMNode();
      node.scrollTop = node.scrollHeight;
    }
  },

  render: function() {
    var output = [];
    var frames = this.props.frames.frames;
    var summary = this.props.frames.summary;
    var removedFrames = this.props.removedFrames;

    if (removedFrames > 0) {
      output.push(PacketsLimit({
        removedPackets: removedPackets
      }));
    }

    for (var i in frames) {
      var frame = frames[i];

      output.push(Frame({
        key: frame.id,
        frame: frame,
        actions: this.props.actions,
        selection: this.props.selection,
        showInlineDetails: this.props.showInlineDetails
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
 * @template TODO docs
 */
var Frame = React.createFactory(React.createClass({
/** @lends Frame */

  displayName: "Frame",

  /**
   * Packet needs to be re-rendered only if the selection or
   * 'show inline details' option changes. This is an optimization
   * the makes the packet-list rendering a lot faster.
   */
  shouldComponentUpdate: function(nextProps, nextState) {
/*    var { contextMenu: prevContextMenu } = this.state || {};
    var { contextMenu: nextContextMenu } = nextState || {};

    return (this.props.selected != nextProps.selected ||
      this.props.showInlineDetails != nextProps.showInlineDetails ||
      prevContextMenu != nextContextMenu);*/
  },

  render: function() {
    var packet = this.props.frame;

    console.log("frame", packet);

    var data = packet.header ? packet.header : packet.maskBit;
    var type = packet.header ? "send" : "receive";
    var mode = "tiny";
    var classNames = ["frameBubble", type];
    var size = Str.formatSize(data.payload.length);

    var payload = Str.cropString(data.payload, 50);
    var size = Str.formatSize(data.payload.length);
    var time = new Date(data.timeStamp / 1000);
    var timeText = time.getHours() + ":" + time.getMinutes() +
      ":" + time.getSeconds() + "." + time.getMilliseconds();

    var previewData = {
      frame: packet
    };

    // Error packets have its own styling
    if (packet.error) {
      classNames.push("error");
    }

    // Selected packets are highlighted
    if (this.props.selection == packet) {
      classNames.push("selected");
    }

    // Inline preview component
    this.props.showInlineDetails = true;
    var preview = this.props.showInlineDetails ? TreeView(
      {data: previewData, mode: mode}) : null;

    var label = (type == "send") ?
      Locale.$STR("websocketmonitor.label.sent") :
      Locale.$STR("websocketmonitor.label.received");

    return (
      div({className: classNames.join(" "), onClick: this.onClick,
           onContextMenu: this.onContextMenu},
        div({className: "frameBox"},
          div({className: "frameContent"},
            div({className: "body"},
              span({className: "text"}, label),
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

  // Event Handlers

  onClick: function(event) {
    var target = event.target;

    event.stopPropagation();
    event.preventDefault();

    // If a 'memberLabel' is clicked inside the inline preview
    // tree, let's process it by the tree, so expansion and
    // collapsing works. Otherwise just select the packet.
    if (!target.classList.contains("memberLabel")) {
      this.props.actions.selectPacket(this.props.data);
    }
  },
}));

// Exports from this module
exports.FrameList = FrameList;
});
