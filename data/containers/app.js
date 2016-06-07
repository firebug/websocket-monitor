/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  // React & Redux
  const React = require("react");
  const { connect } = require("react-redux");

  // Firebug SDK
  const { createFactories } = require("reps/rep-utils");
  const { Splitter } = createFactories(require("reps/splitter"));
  const { Events } = require("reps/core/events");

  // WebSockets Monitor
  const { MainToolbar } = createFactories(require("../components/main-toolbar"));
  const { Sidebar } = createFactories(require("../components/sidebar"));
  const { FrameTable } = createFactories(require("../components/frame-table"));
  const { FrameList } = createFactories(require("../components/frame-list"));
  const { selectNextFrame, selectPrevFrame } = require("../actions/selection");

  // Shortcuts
  const { div } = React.DOM;

  /**
   * The top level application component responsible for rendering
   * the entire UI.
   */
  let App = React.createClass({
  /** @lends App */

    displayName: "App",

    componentDidMount: function () {
      key("up", this.onKeyUp);
      key("down", this.onKeyDown);
    },

    componentWillUnmount: function () {
      key.unbind("up", this.onKeyUp);
      key.unbind("down", this.onKeyDown);
    },

    onKeyUp: function (event) {
      this.props.dispatch(selectPrevFrame());
      Events.cancelEvent(event);
    },

    onKeyDown: function (event) {
      this.props.dispatch(selectNextFrame());
      Events.cancelEvent(event);
    },

    render: function () {
      const perspective =
        this.props.perspective || this.props.defaultPerspective;
      const newProps = Object.assign({}, this.props, { perspective });

      // There are two ways how to display frames:
      // 1) table view
      // 2) list view
      let panelContent = (perspective == "table") ?
        FrameTable(this.props) :
        FrameList(this.props);

      // Render main panel content. It consists of a toolbar and content.
      // The content displays list of frames.
      let leftPanel =
        div({className: "mainPanel"},
          MainToolbar(newProps),
          div({className: "mainPanelContent"}, panelContent)
        );

      // Render side bar with side panels.
      let rightPanel =
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
      config: state.config,
      selection: state.frames.selection,
      perspective: state.perspective
    };
  }

  // Exports from this module
  exports.App = connect(mapStateToProps)(App);
});
