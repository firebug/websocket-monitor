/* See license.txt for terms of usage */

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
window.on(EVENTS.RECEIVED_REQUEST_HEADERS, (event, from) => {
  var requestItem = NetMonitorView.RequestsMenu.getItemByValue(from);
  var attachment = requestItem.attachment;
  var requestHeaders = attachment.requestHeaders;

  // Find the 'upgrade' header.
  var upgradeHeader = requestHeaders.headers.find(header => {
    return (header.name == "Upgrade");
  });

  // Bail out if there is no such header of if its value isn't 'websocket'.
  if (!upgradeHeader || upgradeHeader.value != "websocket") {
    return;
  }

  // Append WebSocket icon in the UI
  var hbox = requestItem._target;
  var status = hbox.querySelector(".requests-menu-status");
  status.classList.add("websocket");

  // Register click handler and emit an event that is handled
  // in the 'WsmNetworkOverlay' overlay.
  window.addEventListener("click", event => {
    if (event.target.classList.contains("websocket")) {
      // The 'window' object is decorated with event API by EventEmitter
      // in client/netmonitor/netmonitor-controller.js module.
      window.emit("websocketmonitor:navigate", from);
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
