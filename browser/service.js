#!/usr/bin/env node

/*globals require */

'use strict';

var commands = require('./commands');

commands.forEach(function(command) {
  exports[command] = function() {
    var drone = window.drone;

    if (drone) {
      drone[command].apply(drone, arguments);
    }

    var cb = arguments[arguments.length - 1];
    cb();
  };
});