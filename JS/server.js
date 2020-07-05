const http = require('http');
const express = require('express');
var tr = require('tor-request');
const app = express();

tr.setTorAddress("127.0.0.1", 9050); // "127.0.0.1" and 9050 by default

app.get("/push", (req, res, next) => { // Somehow pass pushURL from the functions.js script
  let theTx = req.query.tx;

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
