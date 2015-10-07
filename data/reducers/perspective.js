/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

const { types } = require("../actions/perspective");

const initialState = null;

function perspective(state = initialState, action) {
  switch (action.type) {
  case types.CHANGE_VIEW:
    return action.view;

  default:
    return state;
  }
}

// Exports from this module
exports.perspective = perspective;
});

