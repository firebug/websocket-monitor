/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// WebSockets Monitor
const { types } = require("../actions/frames");
const { types: selectionTypes } = require("../actions/selection");

/**
 * Initial state definition
 */
function getInitialState() {
  return {
    frames: [],
    selection: null,
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

  case selectionTypes.SELECT_FRAME:
    return selectFrame(state, action.frame);

  case selectionTypes.SELECT_NEXT_FRAME:
    return selectNextFrame(state);

  case selectionTypes.SELECT_PREV_FRAME:
    return selectPrevFrame(state);

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
    var data = frame.data;
    totalSize += data.payload.length;
    startTime = startTime ? startTime : data.timeStamp;
    endTime = data.timeStamp;
    frameCount++;
  });

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
      var data = frame.data;
      if (data.payload.indexOf(filter.text) != -1) {
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

// Selection

function selectFrame(state, frame) {
  return Object.assign({}, state, {
    selection: frame
  });
}

function selectNextFrame(state) {
  if (!state.frames.length) {
    return state;
  }

  var frame;
  var index = state.frames.indexOf(state.selection);
  if (index == -1) {
    index = 0;
  } else {
    index = Math.min(++index, state.frames.length-1);
  }

  return Object.assign({}, state, {
    selection: state.frames[index]
  });
}

function selectPrevFrame(state) {
  if (!state.frames.length) {
    return state;
  }

  var frame;
  var index = state.frames.indexOf(state.selection);
  if (index == -1) {
    index = 0;
  } else {
    index = Math.max(--index, 0);
  }

  return Object.assign({}, state, {
    selection: state.frames[index]
  });
}

// Exports from this module
exports.frames = frames;
});

