#!/usr/bin/env node

/*globals require */

'use strict';

var websocket = require('websocket-stream');
var ws = websocket('ws://localhost:3000');

ws.once('connect', function() {
  console.log('connected');
});

var rpc = require('rpc-stream');
var service = require('./service');
var server = rpc(service);

server.pipe(ws).pipe(server);