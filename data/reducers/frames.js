/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// WebSockets Monitor
const { types } = require("../actions/frames");

// Constants
const FRAME_LIMIT = 500;

const initialState = {
  frames: [],
  selection: null
};

function frames(state = initialState, action) {
  switch (action.type) {
  case types.ADD_FRAME:
    return addFrames(state, [action.frame]);

  case types.ADD_FRAMES:
    return addFrames(state, action.frames);

  case types.CLEAR:
    return {
      frames: [],
      selection: null
    }

  default:
    return state;
  }
}

// Helpers

function addFrames(state, newFrames) {
  var frames = [...state.frames, ...newFrames];
  if (frames.length > FRAME_LIMIT) {
    frames.splice(0, frames.length - FRAME_LIMIT);
  }

  // Return new state
  return {
    frames: frames,
    selection: state.selection
  }
}

// Exports from this module
exports.frames = frames;
});

