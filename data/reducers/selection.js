/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

const { types: selectionTypes } = require("../actions/selection");
const { types: frameTypes } = require("../actions/frames");

const initialState = null;

function selection(state = initialState, action) {
  switch (action.type) {
  case selectionTypes.SELECT_FRAME:
    return action.frame;

  case frameTypes.CLEAR:
    return null;

  default:
    return state;
  }
}

// Exports from this module
exports.selection = selection;
});
