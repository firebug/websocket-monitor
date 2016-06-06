/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  // Redux
  const { combineReducers } = require("redux");

  // WebSockets Monitor
  const { frames } = require("./frames");
  const { perspective } = require("./perspective");
  const { config } = require("./config");

  let rootReducer = combineReducers({
    frames,
    perspective,
    config
  });

  // Exports from this module
  exports.rootReducer = rootReducer;
});
