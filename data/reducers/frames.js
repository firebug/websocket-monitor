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
    text: "",
    frames: null
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
    return filterFrames(state, action.filter);

  case types.CLEAR:
    return clear(state);

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

  var { totalSize, frameCount, startTime, endTime } = state.summary;

  // Update summary info
  newFrames.forEach(frame => {
    totalSize += frame.payload.length;
    startTime = startTime ? startTime : frame.timeStamp;
    endTime = frame.timeStamp;
    frameCount++;
  });

  // Return new state
  var newState = Object.assign({}, state, {
    frames: frames,
    summary: {
      totalSize: totalSize,
      startTime: startTime,
      endTime: endTime,
      frameCount: frameCount
    }
  });

  // Apply filter on incoming frames.
  if (newState.filter.text) {
    return filterFrames(newState, newState.filter);
  }

  return newState;
}

function filterFrames(state, filter) {
  var frames;

  var summary = {
    totalSize: 0,
    startTime: 0,
    endTime: 0,
    frameCount: 0
  };

  if (filter.text) {
    frames = state.frames.filter(frame => {
      if (frame.payload.indexOf(filter.text) != -1) {
        summary.totalSize += frame.payload.length;
        summary.startTime = summary.startTime ? summary.startTime : frame.timeStamp;
        summary.endTime = frame.timeStamp;
        summary.frameCount++;
        return true;
      }
    });
  } else {
    summary = null;
  }

  return Object.assign({}, state, {
    filter: {
      text: filter.text,
      frames: frames,
      summary: summary,
    }
  });
}

function clear(state) {
  // All data are cleared except of the current filter.
  var newState = clone(initialState);
  newState.filter.text = state.filter.text;
  return newState;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Exports from this module
exports.frames = frames;
});

