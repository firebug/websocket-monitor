/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Redux
const { combineReducers } = require("redux");

// WebSockets Monitor
const { frames } = require("./frames");
const { selection } = require("./selection");

var rootReducer = combineReducers({
  frames,
  selection
});

// Exports from this module
exports.rootReducer = rootReducer;
});
