/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// WebSockets Monitor
const { types } = require("../actions/frames");

/**
 * Initial state definition
 */
const initialState = {
  frames: [],
  selection: null,
  filter: {
    text: ""
  }
};

function frames(state = initialState, action) {
  switch (action.type) {
  case types.ADD_FRAME:
    return addFrames(state, [action.frame]);

  case types.ADD_FRAMES:
    return addFrames(state, action.frames);

  case types.FILTER_FRAMES:
    return {
      frames: state.frames,
      selection: state.selection,
      filter: action.filter || ""
    }

  case types.CLEAR:
    return {
      frames: [],
      selection: null,
      filter: state.filter
    }

  default:
    return state;
  }
}

// Helpers

function addFrames(state, newFrames) {
  const maxEntries = Options.get("max_entries");

  var frames = [...state.frames, ...newFrames];
  if (frames.length > maxEntries) {
    frames.splice(0, frames.length - maxEntries);
  }

  // Return new state
  return {
    frames: frames,
    selection: state.selection,
    filter: state.filter
  }
}

// Exports from this module
exports.frames = frames;
});

