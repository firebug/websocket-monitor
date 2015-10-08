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
  filter: {
    text: ""
  },
  summary: {
    totalSize: 0,
    startTime: 0,
    endTime: 0,
    frameCount: 0
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
      filter: action.filter || "",
      summary: state.summary
    }

  case types.CLEAR:
    return {
      frames: [],
      filter: state.filter,
      summary: {
        totalSize: 0,
        startTime: 0,
        endTime: 0,
        frameCount: 0
      }
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

  var totalSize = state.summary.totalSize;
  var frameCount = state.summary.frameCount;
  var startTime = state.summary.startTime;
  var endTime = state.summary.endTime;

  // Update summary info
  newFrames.forEach(frame => {
    var data = frame.header ? frame.header : frame.maskBit;
    totalSize += data.payload.length;
    startTime = startTime ? startTime : data.timeStamp;
    endTime = data.timeStamp;
    frameCount++;
  });

  // Return new state
  return {
    frames: frames,
    selection: state.selection,
    filter: state.filter,
    summary: {
      totalSize: totalSize,
      startTime: startTime,
      endTime: endTime,
      frameCount: frameCount
    }
  }
}

// Exports from this module
exports.frames = frames;
});

