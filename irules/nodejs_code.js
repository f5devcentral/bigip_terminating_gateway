const http = require("http");
const f5 = require("f5-nodejs");
 
// Initialize ILX Server
var ilx = new f5.ILXServer();
ilx.addMethod('func', function(req, res) {
var retstr = "";
var sni_name = req.params()[0];
var spiffe = req.params()[1];
var serial_id = req.params()[2];
const regex = /[^.]*/;
let targetarr = sni_name.match(regex);
target = targetarr.toString();
console.log('Target is --------------------> ', target.toString());
console.log('My Spiffe ID is: ', spiffe);
console.log('My Serial ID is: ', serial_id);
//Construct request payload
var data = JSON.stringify({
    "Target": target, "ClientCertURI": spiffe, "ClientCertSerial": serial_id
});
//Strip off newline character(s)
data = data.replace(/\\n/g, '') ;
// Construct connection settings
const options = {
  hostname: '10.0.0.100',
  port: 8500,
  path: '/v1/agent/connect/authorize',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};
// Construct Consul sideband HTTP Call
const myreq = http.request(options, res2 => {
  console.log(`Posting Json to Consul -------> statusCode: ${res2.statusCode}`);
 
  res2.on('data', d => {
    //capture response payload
    process.stdout.write(d);
    retstr += d;
  });
  res2.on('end', d => {
    //Check response for Valid Authorizaion and return back to TCL iRule
    var isVal = retstr.includes(":true");
    res.reply(isVal);
  });
});
 
myreq.on('error', error => {
  console.error(error);
});
 
// Intiate Consul Call
myreq.write(data);
myreq.end();
});
// Start ILX listener
ilx.listen();
