/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  const types = {
    CHANGE_VIEW: "CHANGE_VIEW",
  };

  function showTableView() {
    return { type: types.CHANGE_VIEW, view: "table" };
  }

  function showListView() {
    return { type: types.CHANGE_VIEW, view: "list" };
  }

  // Exports from this module
  exports.showTableView = showTableView;
  exports.showListView = showListView;
  exports.types = types;
});

