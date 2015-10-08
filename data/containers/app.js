/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// React & Redux
const React = require("react");
const { connect } = require("react-redux");

// Firebug SDK
const { createFactories } = require("reps/rep-utils");
const { Reps } = require("reps/reps");
const { Splitter } = createFactories(require("reps/splitter"));

// WebSockets Monitor
const { MainToolbar } = createFactories(require("../components/main-toolbar"));
const { Sidebar } = createFactories(require("../components/sidebar"));
const { FrameTable } = createFactories(require("../components/frame-table"));
const { FrameList } = createFactories(require("../components/frame-list"));

// Shortcuts
const { div } = React.DOM;

/**
 * The top level application component responsible for rendering
 * the entire UI.
 */
var App = React.createClass({
/** @lends App */

  displayName: "App",

  getInitialState: function() {
    return { data: [] };
  },

  componentWillUpdate: function() {
    var panelBox = this.getDOMNode();
    var node = panelBox.querySelector(".mainPanelContent");
    this.state.shouldScrollBottom = node.scrollTop == node.scrollTopMax;
  },

  componentDidUpdate: function() {
    if (this.state.shouldScrollBottom) {
      var panelBox = this.getDOMNode();
      var node = panelBox.querySelector(".mainPanelContent");
      node.scrollTop = node.scrollTopMax;
    }
  },

  onClickRow: function(frame) {
    this.store.dispatch(selectFrame(frame));
  },

  render: function() {
    const { perspective } = this.props;

    // There are two ways how to display frames:
    // 1) table view
    // 2) list view
    var panelContent = (perspective == "table") ?
      FrameTable(this.props) :
      FrameList(this.props);

    // Render main panel content. It consists of a toolbar and content.
    // The content displays list of frames.
    var leftPanel =
      div({className: "mainPanel"},
        MainToolbar(this.props),
        div({className: "mainPanelContent"}, panelContent)
      );

    // Render side bar with side panels.
    var rightPanel =
      div({className: "sidePanel"},
        Sidebar(this.props)
      );

    return (
      div({className: "mainPanelBox"},
        Splitter({
          mode: "vertical",
          min: 200,
          leftPanel: leftPanel,
          rightPanel: rightPanel,
          innerBox: div({className: "innerBox"})
        })
      )
    );
  }
});

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps(state) {
  return {
    frames: state.frames,
    selection: state.selection,
    perspective: state.perspective
  };
}

// Exports from this module
exports.App = connect(mapStateToProps)(App);
});
