/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// WebSockets Monitor
const { types } = require("../actions/frames");

/**
 * Initial state definition
 */
function getInitialState() {
  return {
    frames: [],
    pausedFrames: [],
    paused: false,
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
}

function frames(state = getInitialState(), action) {
  switch (action.type) {
  case types.ADD_FRAME:
    return addFrames(state, [action.frame]);

  case types.ADD_FRAMES:
    return addFrames(state, action.frames);

  case types.FILTER_FRAMES:
    return filterFrames(state, action.filter);

  case types.CLEAR:
    return clear(state);

  case types.TOGGLE_PAUSE:
    return togglePause(state);

  default:
    return state;
  }
}

// Helpers

function addFrames(state, newFrames) {
  const maxEntries = Options.get("max_entries");

  var { frames, pausedFrames } = state;
  if (!state.paused) {
    frames = [...state.frames, ...newFrames];
  } else {
    pausedFrames = [...pausedFrames, ...newFrames];
  }

  if (frames.length > maxEntries) {
    frames.splice(0, frames.length - maxEntries);
  }

  var { totalSize, frameCount, startTime, endTime } = state.summary;

  // Update summary info
  if (!state.paused) {
    newFrames.forEach(frame => {
      var data = frame.header ? frame.header : frame.maskBit;
      totalSize += data.payload.length;
      startTime = startTime ? startTime : data.timeStamp;
      endTime = data.timeStamp;
      frameCount++;
    });
  }

  // Return new state
  var newState = Object.assign({}, state, {
    frames: frames,
    pausedFrames: pausedFrames,
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
      var data = frame.header ? frame.header : frame.maskBit;
      if (data.payload.indexOf(filter.text) != -1) {
        var data = frame.header ? frame.header : frame.maskBit;
        summary.totalSize += data.payload.length;
        summary.startTime = summary.startTime ? summary.startTime : data.timeStamp;
        summary.endTime = data.timeStamp;
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
  var newState = getInitialState();
  newState.filter.text = state.filter.text;
  return newState;
}

function togglePause(state) {
  let newState = Object.assign({}, state, { paused: !state.paused });
  if (!newState.paused) {
    let pausedFrames = newState.pausedFrames;
    newState.pausedFrames = [];
    newState = addFrames(newState, pausedFrames);
  }
  return newState;
}

// Exports from this module
exports.frames = frames;
});

