/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Dependencies
const React = require("react");

// WebSockets Monitor
const { filterFrames } = require("../actions/frames");

// Shortcuts
const { input } = React.DOM;

/**
 * This component renders a search box that allows the
 * user to filter on the content of the frames in the
 * list. It dispatches a "filterFrames" event with the
 * updated text filter.
 */
var SearchBox = React.createClass({
/** @lends SearchBox */

  displayName: "SearchBox",

  getInitialState() {
    return {
      text: ""
    };
  },

  componentDidMount() {
    document.defaultView.addEventListener("theme-changed", this.handleThemeChange);
  },

  componentWillUnmount() {
    document.defaultView.removeEventListener("theme-changed", this.handleThemeChange);
  },

  handleThemeChange(event) {
    const data = event.data;

    // Reset the filter if Firebug theme has been activated or deactivated.
    if (data.newTheme == "firebug" || data.oldTheme == "firebug") {
      this.onChange("");
    }
  },

  onChange(text) {
    const currentFilter = this.props.frames.filter;

    // Dispatch new filter, merging with old filter to
    // retain connectionId filter alongside this filter.
    this.props.dispatch(filterFrames(
      Object.assign({}, currentFilter, { text })
    ));
    this.setState({ text });
  },

  render() {
    return input({
      className: "devtools-searchinput",
      type: "search",
      results: "true",
      value: this.state.text,
      onChange: e => this.onChange(e.target.value)
    });
  }
});

// Exports from this module
exports.SearchBox = SearchBox;
});
