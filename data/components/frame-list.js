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
      output.push(FramesLimit({
        removedframes: removedframes
      }));
    }

    for (var i in frames) {
      var frame = frames[i];

      output.push(FrameBubble({
        key: frame.id,
        frame: frame,
        selection: this.props.selection,
        dispatch: this.props.dispatch
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
    return (this.props.selection != nextProps.selection);
  },

  render: function() {
    var frame = this.props.frame;

    var data = frame.header ? frame.header : frame.maskBit;
    var type = frame.header ? "send" : "receive";
    var mode = "tiny";
    var classNames = ["frameBubble", type];
    var size = Str.formatSize(data.payload.length);

    var payload = Str.cropString(data.payload, 50);
    var size = Str.formatSize(data.payload.length);
    var time = new Date(data.timeStamp / 1000);
    var timeText = time.getHours() + ":" + time.getMinutes() +
      ":" + time.getSeconds() + "." + time.getMilliseconds();

    var previewData = {
      frame: frame
    };

    // Error frames have its own styling
    if (frame.error) {
      classNames.push("error");
    }

    // Selected frames are highlighted
    if (this.props.selection == frame) {
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
      div({className: classNames.join(" "), onClick: this.onClick},
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
    // collapsing works. Otherwise just select the frame.
    if (!target.classList.contains("memberLabel")) {
      if (this.props.frame != this.props.selection) {
        this.props.dispatch(selectFrame(this.props.frame));
      }
    }
  },
}));

// Exports from this module
exports.FrameList = FrameList;
});
