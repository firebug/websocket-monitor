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

  componentDidMount: function() {
    var toolbar = this.refs.toolbar.getDOMNode();
    SearchBox.create(toolbar);
  },

  componentWillUnmount: function() {
    var toolbar = this.refs.toolbar.getDOMNode();
    SearchBox.destroy(toolbar);
  },

  // Commands

  onPause: function() {
  },

  onClear: function() {
    this.props.dispatch(clear());
  },

  // Render

  render: function() {
    return (
      Toolbar({className: "toolbar", ref: "toolbar"},
        /*ToolbarButton({bsSize: "xsmall", onClick: this.onPause},
          Locale.$STR("websocketmonitor.Pause")
        ),*/
        ToolbarButton({bsSize: "xsmall", onClick: this.onClear},
          Locale.$STR("websocketmonitor.Clear")
        )
      )
    );
  },
});

// Exports from this module
exports.MainToolbar = MainToolbar;
});
