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
    uniqueConnections: [],
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
    return clear(state, action.options);

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
  var uniqueConnections = state.uniqueConnections;

  // Update summary info
  newFrames.forEach(frame => {
    var data = frame.data;
    if (data) {
      totalSize += data.payload ? data.payload.length : 0;
      startTime = startTime ? startTime : data.timeStamp;
      endTime = data.timeStamp;
    }

    // Update uniqueConnections.
    //
    // When the platform API supports it, this should be replaced
    // with some API call listing only the current connections on
    // the page.
    if (!uniqueConnections.includes(frame.webSocketSerialID)) {
      uniqueConnections.push(frame.webSocketSerialID);
    }

    if (frame.type == "frame") {
      frameCount++;
    }
  });

  // Return new state
  var newState = Object.assign({}, state, {
    frames,
    uniqueConnections,
    summary: {
      totalSize: totalSize,
      startTime: startTime,
      endTime: endTime,
      frameCount: frameCount
    }
  });

  // Apply filter on incoming frames.
  return filterFrames(newState, newState.filter);
}

function filterFrames(state, filter) {
  var { frames } = state;
  var summary = null;

  if (filter.text) {
    summary = {
      totalSize: 0,
      startTime: 0,
      endTime: 0,
      frameCount: 0
    };

    frames = frames.filter(frame => {
      var data = frame.data;

      // Exclude where data is null (events). Events have no payload
      if (data && data.payload && data.payload.indexOf(filter.text) != -1) {
        summary.totalSize += data.payload.length;
        summary.startTime = summary.startTime ? summary.startTime : data.timeStamp;
        summary.endTime = data.timeStamp;
        summary.frameCount++;
        return true;
      }
    });
  }

  if (filter.webSocketSerialID) {
    summary = {
      totalSize: 0,
      startTime: 0,
      endTime: 0,
      frameCount: 0
    };

    frames = frames.filter(frame => {
      var data = frame.data;
      if (frame.webSocketSerialID === filter.webSocketSerialID) {

        // If data is null, this is not an actual frame, but an event
        // like "connect" or "disconnect". We still want to keep it
        // in the list, though.
        if (data) {
          summary.totalSize += data.payload.length;
          summary.startTime = summary.startTime ? summary.startTime : data.timeStamp;
          summary.endTime = data.timeStamp;
          summary.frameCount++;
        }
        return true;
      }
    });
  }

  return Object.assign({}, state, {
    filter: {
      text: filter.text,
      webSocketSerialID: filter.webSocketSerialID,
      frames: frames,
      summary: summary,
    }
  });
}

function clear(state, options = {}) {
  // All data is cleared except for the current filters.
  var newState = getInitialState();
  newState.filter.text = state.filter.text;

  // Allow clearing on page reload
  if (options.resetIDfilter !== true) {
    newState.filter.webSocketSerialID = state.filter.webSocketSerialID;
  }

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

