/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

const types = {
  UPDATE_CONFIG: "UPDATE_CONFIG",
}

function updateConfig(key, newValue) {
  var data = {
    key,
    newValue
  };

  return { type: types.UPDATE_CONFIG, data };
}

// Exports from this module
exports.updateConfig = updateConfig;
exports.types = types;
});

