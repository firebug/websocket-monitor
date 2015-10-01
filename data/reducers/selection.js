/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

const { types } = require("../actions/selection");

const initialState = null;

function selection(state = initialState, action) {
  switch (action.type) {
  case types.SELECT_FRAME:
    return action.frame;

  default:
    return state;
  }
}

// Exports from this module
exports.selection = selection;
});

