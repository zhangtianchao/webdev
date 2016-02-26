/*
var net = require('net');

var CLIENTADDRESS = "cn.bing.com:80";

// parse "80" and "localhost:80" or even "42mEANINg-life.com:80"
var addrRegex = /^(([a-zA-Z\-\.0-9]+):)?(\d+)$/;

console.log(CLIENTADDRESS);
console.log(process.env.PORT);

var addr = {
    to: addrRegex.exec(CLIENTADDRESS)
};

if (!addr.to) {
    console.log("Please set CLIENTADDRESS env");
    return;
}


net.createServer(function(from) {
    var to = net.createConnection({
        host: addr.to[2],
        port: addr.to[3]
    });
    from.pipe(to);
    to.pipe(from);
    to.on('error', function(){});
}).listen(process.env.PORT, '0.0.0.0');

*/

// ok version

var http = require('http');

http.createServer(onRequest).listen(process.env.PORT);

function onRequest(client_req, client_res) {

    //console.log('serve: ' + client_req.url);


    var options = {
        hostname: 'www.google.com',
        port: 80,
        path: client_req.url,
        method: 'GET'
    };

    var proxy = http.request(options, function(res) {
        res.pipe(client_res, {
            end: true
        });
    });

    client_req.pipe(proxy, {
        end: true
    });
}


/* error
var https = require('https');

https.createServer(onRequest).listen(process.env.PORT);

function onRequest(client_req, client_res) {

    //console.log('serve: ' + client_req.url);


    var options = {
        hostname: 'www.google.com',
        port: 443,
        path: client_req.url,
        method: 'GET'
    };

    var proxy = https.request(options, function(res) {
        res.pipe(client_res, {
            end: true
        });
    });

    client_req.pipe(proxy, {
        end: true
    });
}
*/
