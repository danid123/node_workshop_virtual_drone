#!/usr/bin/env node

/*globals require */

'use strict';

var join = require('path').join;
var express = require('express');

var app = express();

app.use(function(req, res, next){
	console.log('Hey');
	next();
});

app.use(express.static(join(__dirname, 'browser')));

var server = app.listen(3000, function(){
	console.log('HTTP server listening on %j', server.address());
});

var websocket = require('websocket-stream');
var wss = websocket.createServer(
	{server: server}, handleWebsocket);

var rpc = require('rpc-stream')();

var commands = require('./browser/commands');

//drone = ar_clients for real drone
var drone = rpc.wrap(commands);


function handleWebsocket(websocket) {
  rpc.pipe(websocket).pipe(rpc, {end: false}); 
  //end:false so you don't close the rpc stream just because a web socket connection dies
}

//you could also use .get or .delete, etc.
app.post('/takeoff', function(req, res) {
  drone.takeoff(function(err) {
    if (err) {
      res.status(500);
      res.send(err);
    }
    else {
      res.send({ok: true});
    }
  });
});

app.post('/up', function(req, res) {
  var speed = Number(req.query.speed);

  drone.up(speed, function(err) {
    if (err) {
      res.status(500);
      res.send(err);
    }
    else {
      res.send({ok: true});
    }
  });
});

app.post('/land', function(req, res) {

  drone.land(function(err) {
    if (err) {
      res.status(500);
      res.send(err);
    }
    else {
      res.send({ok: true});
    }
  });
});
