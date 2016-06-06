/* See license.txt for terms of usage */

"use strict";

define(function (require, exports) {
  const types = {
    UPDATE_CONFIG: "UPDATE_CONFIG",
  };

  function updateConfig(key, newValue) {
    const data = {
      key,
      newValue
    };

    return { type: types.UPDATE_CONFIG, data };
  }

  // Exports from this module
  exports.updateConfig = updateConfig;
  exports.types = types;
});

