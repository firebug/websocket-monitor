/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  function getOpCodeLabel(frame) {
    let data = frame.data;
    let opCode = parseInt(data.opCode, 10);

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
