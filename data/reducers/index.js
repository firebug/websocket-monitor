/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Redux
const { combineReducers } = require("redux");

// WebSockets Monitor
const { frames } = require("./frames");
const { selection } = require("./selection");
const { perspective } = require("./perspective");

var rootReducer = combineReducers({
  frames,
  selection,
  perspective
});

// Exports from this module
exports.rootReducer = rootReducer;
});
