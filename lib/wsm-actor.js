/* See license.txt for terms of usage */

"use strict";

// Add-on SDK
const { Cc, Ci, Cu } = require("chrome");
const Events = require("sdk/event/core");

// DevTools
const { devtools } = Cu.import("resource://gre/modules/devtools/shared/Loader.jsm", {});
const { console } = Cu.import("resource://gre/modules/devtools/shared/Console.jsm", {});
const { expectState } = devtools["require"]("devtools/server/actors/common");
const protocol = devtools["require"]("devtools/server/protocol");

// Platform
const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});

// Constants
const { method, RetVal, ActorClass, FrontClass, Front, Actor, Arg } = protocol;

/**
 * Bug 1203802 - Websocket Frame Listener API for devtool Network Inspector
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1203802
 */
function safeRequireWebSocketService() {
  try {
    return Cc["@mozilla.org/websocketframe/service;1"].
      getService(Ci.nsIWebSocketFrameService);
  } catch (err) {
    Cu.reportError("WebSocket extension: nsIWebSocketFrameService " +
      "not available! See bug: " +
      "https://bugzilla.mozilla.org/show_bug.cgi?id=1203802");
  }
}

const webSocketService = safeRequireWebSocketService();

/**
 * Custom actor object
 */
var WsmActor = ActorClass({
  typeName: "WsmActor",

  /**
   * Events emitted by this actor.
   */
  events: {
    "frameReceived": { data: Arg(0, "json") },
    "frameSent": { data: Arg(0, "json") },
    "onStart": { data: Arg(0, "json") },
    "onStop": { data: Arg(0, "json") },
    "onMessageAvailable": { data: Arg(0, "json") },
    "onBinaryMessageAvailable": { data: Arg(0, "json") },
    "onAcknowledge": { data: Arg(0, "json") },
    "onServerClose": { data: Arg(0, "json") }
  },

  // Initialization

  initialize: function(conn, parent) {
    Actor.prototype.initialize.call(this, conn);

    console.log("WsmActor.initialize");

    this.parent = parent;
    this.state = "detached";

    // Frame listener needs to be re-registered when page navigation happens.
    this.onNavigate = this.onNavigate.bind(this);
    this.onWillNavigate = this.onWillNavigate.bind(this);
  },

  destroy: function() {
    if (this.state === "attached") {
      this.detach();
    }

    Actor.prototype.destroy.call(this);
  },

  /**
   * Attach to this actor.
   */
  attach: method(expectState("detached", function() {
    if (!webSocketService) {
      return {
        error: "Error: no WebSockets service!"
      }
    }

    this.state = "attached";

    Events.on(this.parent, "navigate", this.onNavigate);
    Events.on(this.parent, "will-navigate", this.onWillNavigate);

    this.addFrameListener();

    return {
      type: "attached"
    }
  }), {
    request: {},
    response: RetVal("json")
  }),

  /**
   * Detach from this actor.
   */
  detach: method(expectState("attached", function() {
    this.state = "detached";

    if (!webSocketService) {
      return;
    }

    Events.off(this.parent, "navigate", this.onNavigate);
    Events.off(this.parent, "will-navigate", this.onWillNavigate);

    this.removeFrameListener();
  }), {
    request: {},
    response: {
      type: "detached"
    }
  }),

  /**
   * Returns title of the content window.
   */
  getConnections: method(expectState("attached", function() {
    let win = this.parent.window;

    return {
      list: ["empty"]
    };
  }), {
    request: {},
    response: RetVal("json"),
  }),

  // nsIWebSocketFrameService listener

  QueryInterface:
    XPCOMUtils.generateQI([Ci.nsIWebSocketFrameListener]),

  frameReceived: function(webSocketSerialID, maskBit, finBit,
    rsvBits, opCode, payload) {
    Events.emit(this, "frameReceived", {
      webSocketSerialID: webSocketSerialID,
      maskBit: maskBit,
      finBit: finBit,
      rsvBits: rsvBits,
      opCode: opCode,
      payload: payload
    });
  },

  frameSent: function(webSocketSerialID, header, payload) {
    Events.emit(this, "frameSent", {
      webSocketSerialID: webSocketSerialID,
      header: header,
      payload: payload
    });
  },

  onStart: function(aWebSocketSerialID) {
    Events.emit(this, "onStart", {
      webSocketSerialID: aWebSocketSerialID
    });
  },

  onStop: function(aWebSocketSerialID, aStatusCode) {
    Events.emit(this, "onStop", {
      webSocketSerialID: aWebSocketSerialID,
      statusCode: aStatusCode
    });
  },

  onMessageAvailable: function(aWebSocketSerialID, aMsg) {
    Events.emit(this, "onMessageAvailable", {
      webSocketSerialID: aWebSocketSerialID,
      msg: aMsg
    });
  },

  onBinaryMessageAvailable: function(aWebSocketSerialID, aMsg) {
    Events.emit(this, "onBinaryMessageAvailable", {
      webSocketSerialID: aWebSocketSerialID,
      msg: aMsg
    });
  },

  onAcknowledge: function(aWebSocketSerialID, aSize) {
    Events.emit(this, "onAcknowledge", {
      webSocketSerialID: aWebSocketSerialID,
      size: aSize
    });
  },

  onServerClose: function(aWebSocketSerialID, aCode, aReason) {
    Events.emit(this, "onServerClose", {
      webSocketSerialID: aWebSocketSerialID,
      code: aCode,
      reason: aReason
    });
  },

  // Events

  onWillNavigate: function({isTopLevel}) {
    console.log("WsmActor.onWillNavigate " + isTopLevel);

    if (isTopLevel) {
      this.removeFrameListener();
    }
  },

  onNavigate: function({isTopLevel}) {
    console.log("WsmActor.onNavigate " + isTopLevel);

    if (isTopLevel) {
      this.addFrameListener();
    }
  },

  // Frame Listener

  addFrameListener: function() {
    var innerId = getInnerId(this.parent.window);
    webSocketService.addListener(innerId, this);
  },

  removeFrameListener: function() {
    var innerId = getInnerId(this.parent.window);
    try {
      webSocketService.removeListener(innerId, this);
    } catch (err) {
      Cu.reportError("WsmActor.removeFrameListener; ERROR " + err, err);
    }
  },
});

// Helpers

function getInnerId(win) {
  return win.top.QueryInterface(Ci.nsIInterfaceRequestor).
    getInterface(Ci.nsIDOMWindowUtils).currentInnerWindowID;
}

/**
 * TODO: docs
 */
var WsmActorFront = FrontClass(WsmActor, {
  initialize: function(client, form) {
    Front.prototype.initialize.call(this, client, form);

    this.actorID = form[WsmActor.prototype.typeName];
    this.manage(this);
  }
});

// Exports from this module
exports.WsmActor = WsmActor;
exports.WsmActorFront = WsmActorFront;
