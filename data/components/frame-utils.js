/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

function getOpCodeLabel(frame) {
  var data = frame.data;
  var opCode = parseInt(data.opCode, 10);

  switch (opCode) {
    case data.OPCODE_CONTINUATION:
      return "CONTINUATION";
    case data.OPCODE_TEXT:
      return "TEXT";
    case data.OPCODE_BINARY:
      return "BINARY";
    case data.OPCODE_CLOSE:
      return "CLOSE";
    case data.OPCODE_PING:
      return "PING";
    case data.OPCODE_PONG:
      return "PONG";
  }

  return "(unknown)";
}

// Exports from this module
exports.getOpCodeLabel = getOpCodeLabel;
});
