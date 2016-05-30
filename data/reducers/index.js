/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Redux
const { combineReducers } = require("redux");

// WebSockets Monitor
const { frames } = require("./frames");
const { perspective } = require("./perspective");
const { config } = require("./config");

var rootReducer = combineReducers({
  frames,
  perspective,
  config
});

// Exports from this module
exports.rootReducer = rootReducer;
});
