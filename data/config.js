/* See license.txt for terms of usage */

/* globals requirejs */

// RequireJS configuration
require.config({
  baseUrl: ".",
  scriptType: "application/javascript;version=1.8",
  paths: {
    "react": "./lib/react/react",
    "react-dom": "./lib/react/react-dom",
    "redux": "./lib/redux/redux",
    "react-redux": "./lib/redux/react-redux",
    "reps": "../node_modules/firebug.sdk/lib/reps",
    "firebug.sdk": "../node_modules/firebug.sdk"
  }
});

// Load the main panel module
requirejs(["main"]);
