/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Dependencies
const React = require("react");

// Firebug.SDK
const { createFactories } = require("reps/rep-utils");
const { Toolbar, ToolbarButton } = createFactories(require("reps/toolbar"));

// WebSockets Monitor
const { clear } = require("../actions/frames");
const { SearchBox } = require("./search-box");

/**
 * @template This object is responsible for rendering the toolbar
 * in Actors tab
 */
var MainToolbar = React.createClass({
/** @lends MainToolbar */

  displayName: "MainToolbar",

  getInitialState: function () {
    return {
      paused: false
    }
  },

  componentDidMount: function() {
    var toolbar = this.refs.toolbar.getDOMNode();
    SearchBox.create(toolbar);
  },

  componentWillUnmount: function() {
    var toolbar = this.refs.toolbar.getDOMNode();
    SearchBox.destroy(toolbar);
  },

  // Commands

  onTogglePause: function() {
    var paused = !this.state.paused;
    this.props.togglePause(paused);
    this.setState({ paused });
  },

  onClear: function() {
    this.props.dispatch(clear());
  },

  onSwitchPerspective: function() {
    var newValue = (this.props.perspective == "table") ? false : true;
    Options.set("tabularView", newValue);
  },

  // Render

  render: function() {
    var perspectiveLabel = (this.props.perspective == "table") ?
      Locale.$STR("websocketmonitor.perspective.listView") :
      Locale.$STR("websocketmonitor.perspective.tableView")

    var pauseLabel = this.state.paused ?
      Locale.$STR("websocketmonitor.Unpause"):
      Locale.$STR("websocketmonitor.Pause");

    return (
      Toolbar({className: "toolbar", ref: "toolbar"},
        ToolbarButton({bsSize: "xsmall", onClick: this.onTogglePause},
          pauseLabel
        ),
        ToolbarButton({bsSize: "xsmall", onClick: this.onClear},
          Locale.$STR("websocketmonitor.Clear")
        ),
        ToolbarButton({bsSize: "xsmall", onClick: this.onSwitchPerspective},
          perspectiveLabel
        )
      )
    );
  },
});

// Exports from this module
exports.MainToolbar = MainToolbar;
});
