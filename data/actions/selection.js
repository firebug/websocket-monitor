/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

const types = {
  SELECT_FRAME: "SELECT_FRAME",
  SELECT_NEXT_FRAME: "SELECT_NEXT_FRAME",
  SELECT_PREV_FRAME: "SELECT_PREV_FRAME"
}

function selectFrame(frame) {
  return { type: types.SELECT_FRAME, frame: frame };
}

function selectNextFrame() {
  return { type: types.SELECT_NEXT_FRAME };
}

function selectPrevFrame() {
  return { type: types.SELECT_PREV_FRAME };
}

// Exports from this module
exports.selectFrame = selectFrame;
exports.selectNextFrame = selectNextFrame;
exports.selectPrevFrame = selectPrevFrame;
exports.types = types;
});

