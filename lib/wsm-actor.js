/* See license.txt for terms of usage */

"use strict";

/**
 * Content of this module is running on the backend, so we can't access
 * e.g. Firebug SDK (which isn't available on the backend by default).
 */

// Add-on SDK
const { Cc, Ci, Cu } = require("chrome");
const Events = require("sdk/event/core");

// DevTools
// See also: https://bugzilla.mozilla.org/show_bug.cgi?id=912121
// We can't use the core/devtools.js module since this code is
// executed on the backend.
var devtools;
try {
  devtools = Cu.import("resource://devtools/shared/Loader.jsm", {}).devtools;
} catch (err) {
  try {
      devtools = Cu.import("resource://gre/modules/devtools/shared/Loader.jsm", {}).devtools;
  } catch (err) {
      devtools = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools;
  }
}
const { expectState } = devtools["require"]("devtools/server/actors/common");
const protocol = devtools["require"]("devtools/server/protocol");

// Platform
const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});

// Constants
const { method, RetVal, ActorClass, FrontClass, Front, Actor, Arg } = protocol;

/**
 * Bug 1203802 - WebSocket Frame Listener API for devtools Network Inspector
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1203802
 *
 * Bug 1215092 - WebSocketFrameService should be used for WebSocket discovering
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1215092
 */
function safeRequireWebSocketEventService() {
  try {
    return Cc["@mozilla.org/websocketevent/service;1"].
      getService(Ci.nsIWebSocketEventService);
  } catch (err) {
    Cu.reportError("WebSocket extension: nsIWebSocketEventService " +
      "not available! See bug: " +
      "https://bugzilla.mozilla.org/show_bug.cgi?id=1203802 and " +
      "https://bugzilla.mozilla.org/show_bug.cgi?id=1215092");
  }
}

const webSocketEventService = safeRequireWebSocketEventService();

/**
 * Custom actor object
 */
var WsmActor = ActorClass({
  typeName: "WsmActor",

  /**
   * Events emitted by this actor.
   */
  events: {
    "webSocketCreated": { data: Arg(0, "json") },
    "webSocketOpened": { data: Arg(0, "json") },
    "webSocketClosed": { data: Arg(0, "json") },
    "webSocketMessageAvailable": { data: Arg(0, "json") },
    "frameReceived": { data: Arg(0, "json") },
    "frameSent": { data: Arg(0, "json") }
  },

  // Initialization

  initialize: function(conn, parent) {
    Actor.prototype.initialize.call(this, conn);

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
    if (!webSocketEventService) {
      return {
        error: "Error: '@mozilla.org/websocketevent/service;1' not available!"
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

    if (!webSocketEventService) {
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

  /**
   * Pause / Unpause the listeners
   */
  togglePause: method(expectState("attached", function (paused) {
    if (paused) {
      this.removeFrameListener();
    } else {
      this.addFrameListener();
    }
  }), {
    request: {
      paused: Arg(0, "boolean")
    }
  }),

  // nsIWebSocketEventService

  QueryInterface:
    XPCOMUtils.generateQI([Ci.nsIWebSocketEventService]),

  webSocketCreated: function(webSocketSerialID, uri, protocols) {
    Events.emit(this, "webSocketCreated", {
      webSocketSerialID: webSocketSerialID,
      uri: uri,
      protocols: protocols
    });
  },

  webSocketOpened: function(webSocketSerialID, effectiveURI, protocols, extensions) {
    Events.emit(this, "webSocketOpened", {
      webSocketSerialID: webSocketSerialID,
      effectiveURI: effectiveURI,
      protocols: protocols,
      extensions: extensions
    });
  },

  webSocketClosed: function(webSocketSerialID, wasClean, code, reason) {
    Events.emit(this, "webSocketClosed", {
      webSocketSerialID: webSocketSerialID,
      wasClean: wasClean,
      code: code,
      reason: reason
    });
  },

  webSocketMessageAvailable: function(webSocketSerialID, data, messageType) {
    Events.emit(this, "webSocketMessageAvailable", {
      webSocketSerialID: webSocketSerialID,
      data: data,
      messageType: messageType
    });
  },

  frameReceived: function(webSocketSerialID, frame) {
    Events.emit(this, "frameReceived", {
      webSocketSerialID: webSocketSerialID,
      data: frame
    });
  },

  frameSent: function(webSocketSerialID, frame) {
    Events.emit(this, "frameSent", {
      webSocketSerialID: webSocketSerialID,
      data: frame
    });
  },

  // Events

  onWillNavigate: function({isTopLevel}) {
    if (isTopLevel) {
      this.removeFrameListener();
    }
  },

  onNavigate: function({isTopLevel}) {
    if (isTopLevel) {
      this.addFrameListener();
    }
  },

  // nsIWebSocketEventService

  addFrameListener: function() {
    var innerId = getInnerId(this.parent.window);
    webSocketEventService.addListener(innerId, this);
  },

  removeFrameListener: function() {
    var innerId = getInnerId(this.parent.window);
    try {
      webSocketEventService.removeListener(innerId, this);
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
 * This object represents the client part of the actor
 * defined above. This part is used on the client side
 * and communicates with the actor (backend) transparently
 * over RDP.
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
