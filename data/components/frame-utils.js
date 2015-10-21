/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

function getOpCodeLabel(frame) {
  var opCode = parseInt(frame.opCode, 10);

  switch (opCode) {
    case frame.OPCODE_CONTINUATION:
      return "CONTINUATION";
    case frame.OPCODE_TEXT:
      return "TEXT";
    case frame.OPCODE_BINARY:
      return "BINARY";
    case frame.OPCODE_CLOSE:
      return "CLOSE";
    case frame.OPCODE_PING:
      return "PING";
    case frame.OPCODE_PONG:
      return "PONG";
  }

  return "(unknown)";
}

// Exports from this module
exports.getOpCodeLabel = getOpCodeLabel;
});
