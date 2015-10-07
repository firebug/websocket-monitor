/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Dependencies
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/reps");
const { Str } = require("reps/core/string");
const { TreeView } = require("reps/tree-view");

// WebSockets Monitor
const { selectFrame } = require("../actions/selection");
const { getOpCodeLabel } = require("./frame-utils");

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
    var removedFrames = summary.frameCount - frames.length;

    // Render number of removed frames from the list if any.
    if (removedFrames > 0) {
      output.push(FrameLimit({
        removedFrames: removedFrames
      }));
    }

    // Render all frames.
    for (var i in frames) {
      var frame = frames[i];
      output.push(FrameBubble({
        key: frame.id,
        frame: frame,
        selection: this.props.selection,
        dispatch: this.props.dispatch
      }));
    }

    // Render summary at the end (if there are any frames displayed).
    if (frames.length > 0) {
      output.push(FrameSummary({
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
var FrameBubble = React.createFactory(React.createClass({
/** @lends FrameBubble */

  displayName: "FrameBubble",

  /**
   * Frames need to be re-rendered only if the selection option changes.
   * This is an optimization that makes the list rendering a lot faster.
   */
  shouldComponentUpdate: function(nextProps, nextState) {
    // xxxHonza: TODO FIXME
    return true;//(this.props.selection != nextProps.selection);
  },

  render: function() {
    var frame = this.props.frame;
    var data = frame.header ? frame.header : frame.maskBit;
    var type = frame.header ? "send" : "receive";
    var size = Str.formatSize(data.payload.length);
    var payload = Str.cropString(data.payload, 50);
    var time = new Date(data.timeStamp / 1000);
    var timeText = time.getHours() + ":" + time.getMinutes() +
      ":" + time.getSeconds() + "." + time.getMilliseconds();

    // Error frames have its own styling
    var classNames = ["frameBubble", type];
    if (frame.error) {
      classNames.push("error");
    }

    // Selected frames are highlighted
    if (this.props.selection == frame) {
      classNames.push("selected");
    }

    // Render inline frame preview.
    var preview = [
      TreeView({data: {"Frame": frame}, mode: "tiny"})
    ];

    if (frame.socketIo) {
      preview.push(
        TreeView({data: {"Socket IO": frame.socketIo}, mode: "tiny"})
      );
    }

    var label = (type == "send") ?
      Locale.$STR("websocketmonitor.label.sent") :
      Locale.$STR("websocketmonitor.label.received");

    return (
      div({className: classNames.join(" "), onClick: this.onClick},
        div({className: "frameBox"},
          div({className: "frameContent"},
            div({className: "body"},
              span({className: "text"}, label),
              span({className: "type"}, getOpCodeLabel(frame)),
              div({className: "payload"},
                Str.cropString(data.payload)
              ),
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
    // collapsing works. Otherwise just select the frame.
    if (!target.classList.contains("memberLabel")) {
      if (this.props.frame != this.props.selection) {
        this.props.dispatch(selectFrame(this.props.frame));
      }
    }
  },
}));

/**
 * @template This template is responsible for rendering a message
 * at the top of the frame list that informs the user about reaching
 * the maximum limit of displayed frames. The message also displays
 * number of frames removed from the list.
 */
var FrameLimit = React.createFactory(React.createClass({
/** @lends FrameLimit */

  displayName: "FrameLimit",

  render: function() {
    var removedFrames = this.props.removedFrames;
    var label = Locale.$STR("websocketmonitor.label.outOfLimit");

    // Render summary info
    return (
      div({className: "frameLimit"},
        span({className: "text"}, removedFrames + " " + label)
      )
    );
  }
}));

/**
 * @template This template is responsible for rendering frame summary
 * information. It displays number of sent and received packets
 * and total amount of sent and received data.
 */
var FrameSummary = React.createFactory(React.createClass({
/** @lends FrameSummary */

  displayName: "FrameSummary",

  render: function() {
    var summary = this.props.summary;
    return (
      div({className: "frameSummary"},
        div({className: "text"},
          Locale.$STRP("websocketmonitor.summary.frameCount", [summary.frameCount])
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
