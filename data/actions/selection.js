/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

const types = {
  SELECT_FRAME: "SELECT_FRAME",
}

function selectFrame(frame) {
  return { type: types.SELECT_FRAME, frame: frame };
}

// Exports from this module
exports.selectFrame = selectFrame;
exports.types = types;
});

