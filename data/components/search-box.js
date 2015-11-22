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

  componentWillMount() {
    this.setState({ win: document.defaultView },
                  () => this.state.win.addEventListener("theme-changed", this.handleThemeChange));
  },

  componentWillUnmount() {
    this.state.win.removeEventListener("theme-changed", this.handleThemeChange);
  },

  handleThemeChange(searchBox, event) {
    const data = event.data;

    // Reset the filter if Firebug theme has been activated or deactivated.
    if (data.newTheme == "firebug" || data.oldTheme == "firebug") {
      searchBox.value = "";
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
  },

  render() {
    const searchBox = input({
      className: "devtools-searchinput",
      type: "search",
      results: "true",
      onChange: e => this.onChange(e.target.value)
    });

    this.handleThemeChange = this.handleThemeChange.bind(this, searchBox);
    return searchBox;
  }
});

// Exports from this module
exports.SearchBox = SearchBox;
});
