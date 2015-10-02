/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

/**
 * TODO docs xxxHonza: use ReactJS.
 */
var SearchBox =
/** @lends SearchBox */
{
  create: function(parentNode) {
    var doc = parentNode.ownerDocument;
    var win = doc.defaultView;
    var toolbar = doc.querySelector(".mainPanel .toolbar");

    // Search box
    var searchBox = doc.createElement("input");
    searchBox.setAttribute("class", "devtools-searchinput");
    searchBox.setAttribute("type", "search");
    searchBox.setAttribute("results", "true");
    toolbar.appendChild(searchBox);

    searchBox.addEventListener("command", this.onChange.bind(this, searchBox), false);
    searchBox.addEventListener("input", this.onChange.bind(this, searchBox), false);
    searchBox.addEventListener("keypress", this.onKeyPress.bind(this, searchBox), false);

    this.handleThemeChange = this.handleThemeChange.bind(this, searchBox);
    win.addEventListener("theme-changed", this.handleThemeChange);
  },

  destroy: function(parentNode) {
    var doc = parentNode.ownerDocument;
    var searchBox = doc.querySelector(".searchBox");
    searchBox.remove();
    win.removeEventListener("theme-changed", this.handleThemeChange);
  },

  handleThemeChange: function(searchBox, event) {
    var data = event.data;
    var win = searchBox.ownerDocument.defaultView;

    // Reset the filter if Firebug theme has been activated or deactivated.
    if (data.newTheme == "firebug" || data.oldTheme == "firebug") {
      searchBox.value = "";
      this.dispatch(win, {
        text: ""
      });
    }
  },

  onKeyPress: function(searchBox/*, event*/) {
    this.onSearch(searchBox);
  },

  onChange: function(searchBox/*, event*/) {
    this.onSearch(searchBox);
  },

  onSearch: function(searchBox) {
    var win = searchBox.ownerDocument.defaultView;
    this.dispatch(win, {
      text: searchBox.value
    });
  },

  dispatch: function(win, filter) {
    var event = new win.MessageEvent("firebug.sdk/chrome-event", {
      data: {
        method: "onSearch",
        args: filter
      }
    });
    win.dispatchEvent(event);
  }
};

// Exports from this module
exports.SearchBox = SearchBox;
});
