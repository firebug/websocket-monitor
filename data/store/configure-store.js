/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// Redux
const { createStore } = require("redux");

// WebSockets Monitor
const { rootReducer } = require("reducers/index");

function configureStore(initialState) {
  return createStore(rootReducer, initialState);
}

// Exports from this module
exports.configureStore = configureStore;
});

