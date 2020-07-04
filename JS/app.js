const express = require('express');
const fetch = require("node-fetch");
var tr = require('tor-request');

const app = express();

var pushUrl = 'http://explorerzydxu5ecjrkwceayqybizmpjjznk5izmitf2modhcusuqlid.onion/testnet/api/tx';
tr.setTorAddress("127.0.0.1", 9050); // "127.0.0.1" and 9050 by default

app.get("/push", (req, res, next) => {
  let theTx = req.query.tx;
  tr.request({
    method: 'POST',
    url: pushUrl,
    body: theTx,
  }, function(error, response, body) {
    res.json(JSON.stringify(body));
  });
});

//export app
module.exports = app;
