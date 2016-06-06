/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  const { types } = require("../actions/config");

  const initialState = {};

  function config(state = initialState, action) {
    switch (action.type) {
      case types.UPDATE_CONFIG:
        state[action.data.key] = action.data.newValue;

        return state;

      default:
        return state;
    }
  }

  // Exports from this module
  exports.config = config;
});

