/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

const types = {
  CLEAR: "CLEAR",
  ADD_FRAME: "ADD_FRAME",
  ADD_FRAMES: "ADD_FRAMES"
}

function clear() {
  return { type: types.CLEAR };
}

function addFrame(frame) {
  return { type: types.ADD_FRAME, frame: frame };
}

function addFrames(frames) {
  return { type: types.ADD_FRAMES, frames: frames };
}

// Exports from this module
exports.clear = clear;
exports.addFrame = addFrame;
exports.addFrames = addFrames;
exports.types = types;
});

