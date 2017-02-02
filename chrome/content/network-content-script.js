/* See license.txt for terms of usage */

"use strict";

/**
 * Handle new requests addition.
 *
 * Instead of handling 'REQUEST_ADDED' we need to catch
 * 'RECEIVED_REQUEST_HEADERS' where request headers are
 * available.
 *
 * In case we are dealing with WebSocket upgrade headers
 * we append a new little icon to the far left side to
 * indicate that this HTTP request initiated WebSocket
 * connection.
 *
 * The icons serves also as a link to the 'Web Socket'
 * panel.
 */
if (EVENTS.REQUEST_ITEM_CLICKED) {
  window.on(EVENTS.REQUEST_ITEM_CLICKED, (_, e, item) => {
    let target = ".request-list-item.websocket .requests-menu-method";
    if (e.target.closest(target)) {
      navigateToWebSocketPanel(item.id);
    }
  });
} else {
  window.on(EVENTS.RECEIVED_REQUEST_HEADERS, (_, from) => {
    let item = NetMonitorView.RequestsMenu.getItemByValue(from);
    if (!isWsUpgradeRequest(item)) {
      return;
    }

    // Append WebSocket icon in the UI
    let hbox = item._target;

    let method = hbox.querySelector(".requests-menu-method");
    method.classList.add("websocket");

    // Fx 45 changed the DOM layout in the network panel and also
    // the WS icon isn't overlapping the original status icon now.
    // But, we need a little indentation for pre Fx45.
    let statusIconNode = hbox.querySelector(".requests-menu-status-icon");
    if (!statusIconNode) {
      // We are in pre Fx45 world, use a little indentation.
      method.classList.add("websocket-indent");
    }

    // Register click handler and emit an event that is handled
    // in the 'WsmNetMonitorOverlay' overlay.
    // xxxHonza: this registers multiple listeners on the window
    // object that are all executed when the user clicks on the
    // WS icon. FIXME
    window.addEventListener("click", event => {
      if (event.target.classList.contains("websocket")) {
        navigateToWebSocketPanel(from);
      }
    });

    // Do not open the Network panel side-bar if the user clicks
    // on the WS icon.
    window.addEventListener("mousedown", event => {
      if (event.target.classList.contains("websocket")) {
        event.stopPropagation();
        event.preventDefault();
      }
    }, true);
  });
}

/**
 * Handle Response body displayed event.
 *
 * The Response tab displays a link to the WebSockets panel
 * for HTTP upgrade requests.
 */
window.on(EVENTS.RESPONSE_BODY_DISPLAYED, () => {
  let wsBox = $("#response-content-ws-box");

  let item = NetMonitorView.RequestsMenu.selectedItem;
  if (!isWsUpgradeRequest(item)) {
    if (wsBox) {
      $("#response-content-ws-box").hidden = true;
    }
    return;
  }

  // Hide the default Response content.
  $("#response-content-textarea-box").hidden = true;

  wsBox = $("#response-content-ws-box");
  if (wsBox) {
    $("#response-content-ws-box").hidden = false;
    return;
  }

  wsBox = document.createElement("vbox");
  wsBox.setAttribute("flex", "1");
  wsBox.setAttribute("id", "response-content-ws-box");

  // xxxHonza: localization
  wsBox.innerHTML =
    "<div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"webSocketsInfo\">" +
    "<div class=\"title\">Web Socket Protocol Handshake (101)</div>" +
    "<div class=\"desc\">No content for this request. If you want to " +
    "monitor WebSockets communication you need to switch to the " +
    "<a class=\"link\">Web Sockets</a> panel.</div>" +
    "</div>";

  // Append into the DOM
  let imageBox = $("#response-content-image-box");
  let parentNode = imageBox.parentNode;
  parentNode.appendChild(wsBox);

  let link = parentNode.querySelector(".link");
  link.addEventListener("click", event => {
    navigateToWebSocketPanel(item._value);
  });
});

// Helpers

function navigateToWebSocketPanel(requestId) {
  // The 'window' object is decorated with event API by EventEmitter
  // in client/netmonitor/netmonitor-controller.js module.
  window.emit("websocketmonitor:navigate", requestId);
}

function isWsUpgradeRequest(item) {
  let attachment = item.attachment;
  let requestHeaders = attachment.requestHeaders;

  // Find the 'upgrade' header.
  let upgradeHeader = requestHeaders.headers.find(header => {
    return (header.name == "Upgrade");
  });

  // Return false if there is no such header of if its value isn't 'websocket'.
  if (!upgradeHeader || upgradeHeader.value != "websocket") {
    return false;
  }

  return true;
}
