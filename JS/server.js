const http = require('http');
const express = require('express');
var tr = require('tor-request');
const app = express();

tr.setTorAddress("127.0.0.1", 9050); // "127.0.0.1" and 9050 by default

app.get("/push", (req, res, next) => { // Somehow pass pushURL from the functions.js script
  let theTx = req.query.tx;
  let theService = req.query.service;
  if (theService === 'mempool') {
    var pushUrl = 'http://mempoolhqx4isw62xs7abwphsq7ldayuidyx2v2oethdhhj6mlo2r6ad.onion/testnet/api/tx';
  } else {
    var pushUrl = 'http://explorerzydxu5ecjrkwceayqybizmpjjznk5izmitf2modhcusuqlid.onion/testnet/api/tx';
  }
  tr.request({
    method: 'POST',
    url: pushUrl,
    body: theTx,
  }, function(error, response, body) {
    res.json(JSON.stringify(body));
  });
});

// Start webserver
const listener = app.listen(process.env.PORT || 3100, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
