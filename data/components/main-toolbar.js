/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Dependencies
const React = require("react");
const ReactDOM = require("react-dom");

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
    var toolbar = ReactDOM.findDOMNode(this.refs.toolbar);
    SearchBox.create(toolbar);
  },

  componentWillUnmount: function() {
    var toolbar = ReactDOM.findDOMNode(this.refs.toolbar);
    SearchBox.destroy(toolbar);
  },

  // Commands

  onTogglePause: function() {
    var paused = !this.state.paused;

    // xxxHonza: the 'toggle-pause' actions is asynchronous since
    // it needs to be sent to the backend actor. The UI should
    // reflect that by e.g. disabling the button till a confirmation
    // is received from the backend.
    // See also:
    // http://rackt.org/redux/docs/advanced/AsyncActions.html
    // http://danmaz74.me/2015/08/19/from-flux-to-redux-async-actions-the-easy-way/
    // http://www.code-experience.com/async-requests-with-react-js-and-flux/
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
