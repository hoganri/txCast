// TxCast (JS) by 6102bitcoin

var txList = []; // List of user submitted signed transactions
var timeList = []; // List of random times to broadcast
var timeList_remaining = [];
var txList_remaining = [];
var timeList_processed = [];
var txList_processed = [];
var tx = "";
var delayDays;
var delayHours;
var remainingms = 0;
var pushUrl = "";
var pushDomain = "";
// var request = require('request');
// var tr = require('tor-request');

function addTransaction() {  // Add a transaction
  var tx = document.getElementById("inputTx").value;  // Get user input tx
  txList.push(tx);                                    // Add tx to List
  document.getElementById("txList").innerHTML += '<br>' + shortTx(tx); // Update visble list
  document.getElementById("inputTx").value = "Paste Next Signed TX";  // Update Button Label
  document.getElementById("descriptionTx").innerHTML = "Repeat for all transactions. Then move to next step."; // Update Description
}

function shuffleList(list) { // Shuffle order of list
  // Uses Fisher-Yates algorithm (tutorialspoint.com/what-is-fisher-yates-shuffle-in-javascript)
  var i = list.length, k , temp;      // k is to generate random index and temp is to swap the values
  while(--i > 0){
      k = Math.floor(Math.random() * (i+1));
      temp = list[k];
      list[k] = list[i];
      list[i] = temp;
   }
   return list
}

function clearTransactions() {
  txList = [] // Reset transaction list
  timeList = [] // Reset time list
  document.getElementById("txList").innerHTML = txList; // Update visible tx list
  document.getElementById("inputTx").value = "Paste Signed TX";  // Reset input form
}

function setDelay() {// Set Delay
  delayDays = document.getElementById("setDelayDays").value;  // Get Delay (Days)
  if (delayDays == "") { // Default to 0
    delayDays = 0;
  }
  delayHours = document.getElementById("setDelayHours").value;  // Get Delay (Hours)
  if (delayHours == "") { // Default to 0
    delayHours = 0;
  }
  document.getElementById("delay").innerHTML = "Max Delay Set: " + delayDays + " Days, " + delayHours + " hours."; // Print Delay
}

function generateTimes(){ // Calculate Times & Show
  timeList = [] // Reset time list
  var min = Date.now();
  var max = Date.now() + delayDays*24*60*60*1000 + delayHours*60*60*1000;
  var x = 0;
  while (x < txList.length){ // Generate time for each transaction
    var time = min + Math.floor(Math.random() * (max - min));
    timeList.push(time);
    x++;
  }
  timeList.sort(); // Order times chronologically
}

function shortTx(tx){ // Abbreviate Transaction for Viewing
  var shortTx = tx.slice(0, 3) + " ... " + tx.slice(-3);
  return shortTx
}

function msToUTCString(time) { // Convert time from ms to String
  var d = new Date(time);
  var n = d.toUTCString("");
  return n
}

function makeTableRemaining(){ // Make table of remaining Transactions

  // Build Tabke
  var myTable= "<table><tr><td style='width: 100px; text-align: center;'>Transaction</td>"; // Header (tx)
  myTable+="<td style='width: 250px; text-align: center;'>Time</td></tr>";                  // Header (time)

  myTable+="<tr><td     style='width: 150px; text-align: center;'>---</td>";    // Seperator Column 1
  myTable+="<td     style='width: 100px; text-align: center;'>---</td></tr>";   // Seperator Column 2

  for (var i=0; i<txList_remaining.length; i++) {
    myTable+="<tr><td style='width: 100px; text-align: center;'>" + shortTx(txList_remaining[i]); + "</td>";          // Content Column (tx)
    myTable+="<td style='width: 100px; text-align: center;'>" + msToUTCString(timeList_remaining[i]); + "</td></tr>"; // Content Column (time)
  }
   myTable+="</table>";

  document.getElementById('tableRemaining').innerHTML = myTable;
}

function makeTableProcessed(){ // Make table of processed Transactions

  // Build Tabke
  var myTable= "<table><tr><td style='width: 100px; text-align: center;'>Transaction</td>"; // Header (tx)
  myTable+="<td style='width: 250px; text-align: center;'>Time</td></tr>";                  // Header (time)

  myTable+="<tr><td     style='width: 150px; text-align: center;'>---</td>";    // Seperator Column 1
  myTable+="<td     style='width: 100px; text-align: center;'>---</td></tr>";   // Seperator Column 2

  for (var i=0; i<txList_processed.length; i++) {
    myTable+="<tr><td style='width: 100px; text-align: center;'>" + shortTx(txList_processed[i]); + "</td>";          // Content Column (tx)
    myTable+="<td style='width: 100px; text-align: center;'>" + msToUTCString(timeList_processed[i]); + "</td></tr>"; // Content COlumn (time)
  }
   myTable+="</table>";

  document.getElementById('tableProcessed').innerHTML = myTable;
}

function timer() { // Print Current Time
  var today = new Date();
  var h = today.getUTCHours();
  var m = today.getUTCMinutes();
  var s = today.getUTCSeconds();
  document.getElementById('time').innerHTML = today.toUTCString();
}

function countdown() { // Count Down to next broadcast time
  var nextTime = timeList_remaining[0];
  var now = new Date();
  remainingms = nextTime - now;
  var remaining = new Date(remainingms);
  var h = remaining.getUTCHours();
  var m = remaining.getUTCMinutes();
  var s = remaining.getUTCSeconds();
  document.getElementById('countdown').innerHTML = h + " hours : " + m + " minutes : " + s + " seconds";
}

function checkNextTime(){ // Check if next broadcast time has elapsed
  if (remainingms < 0){
    pushTx(txList_remaining[0]);                      // Broadcast Transaction
    timeList_processed.push(timeList_remaining[0]);   // Add first element of remaining time list
    txList_processed.push(txList_remaining[0]);       // Add first element of remaining tx list
    timeList_remaining.shift();  // Remove first element of remaining time list
    txList_remaining.shift();      // Remove first element of remaining tx list
    makeTableRemaining(); // Update Table
    makeTableProcessed(); // Update Table
  }
}

function runScript(){// Run main script
  document.getElementById('status').innerHTML = "RUNNING";
  getSelectedOnion();
  setDelay();
  shuffleList(txList);      // Randomise Order
  generateTimes();          // Generate Random times (& Order chronologically)
  timeList_remaining = timeList; // Make copy of timeList
  txList_remaining = txList;     // Make copy of txList
  makeTableRemaining();              // Create a table of this info
  makeTableProcessed();              // Create a table of this info
  loop();                   // Run the looping script
}

function check(){ // Check if all transactions have been broadcast
  if (timeList_remaining.length > 0){
    loop();
  }
  else {
    document.getElementById('status').innerHTML = "COMPLETE";
  }
}

function loop(){
  t = setTimeout(function() {
    timer();                // Show Time
    countdown();            // Show Countdown Timer
    checkNextTime();        // Check if next time exceeded, process tx if yes
    check();                // Check if process is complete, show Complete if yes
  }, 500);                  // Note: May want to randomise to reduce data leak
}

function pushTx(tx){// Broadcast Transaction via Tor
  url = "http://localhost:3100/push?tx=" + tx
  let response = fetch(url, {  // Somehow pass pushURL to the server as an input
    method: 'GET',
  });
}

function getSelectedOnion(){
  var e = document.getElementById("onion");
  pushUrl = e.options[e.selectedIndex].value;
  pushDomain = e.options[e.selectedIndex].text;
  //document.getElementById("onionSelected").innerHTML = pushDomain;
}
