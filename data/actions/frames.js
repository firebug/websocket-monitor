/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

const types = {
  CLEAR: "CLEAR",
  ADD_FRAME: "ADD_FRAME",
  ADD_FRAMES: "ADD_FRAMES",
  FILTER_FRAMES: "FILTER_FRAMES",
}

function clear(options) {
  return { type: types.CLEAR, options };
}

function addFrame(frame) {
  return { type: types.ADD_FRAME, frame: frame };
}

function addFrames(frames) {
  return { type: types.ADD_FRAMES, frames: frames };
}

function filterFrames(filter) {
  return { type: types.FILTER_FRAMES, filter: filter };
}

// Exports from this module
exports.clear = clear;
exports.addFrame = addFrame;
exports.addFrames = addFrames;
exports.filterFrames = filterFrames;
exports.types = types;
});

