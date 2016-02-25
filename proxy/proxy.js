
/*
var net = require('net');

// parse "80" and "localhost:80" or even "42mEANINg-life.com:80"
var addrRegex = /^(([a-zA-Z\-\.0-9]+):)?(\d+)$/;

var addr = {
    from: addrRegex.exec(process.argv[2]),
    to: addrRegex.exec(process.argv[3])
};

if (!addr.from || !addr.to) {
    console.log('Usage: <from> <to>');
    return;
}

net.createServer(function(from) {
    var to = net.createConnection({
        host: addr.to[2],
        port: addr.to[3]
    });
    from.pipe(to);
    to.pipe(from);
}).listen(addr.from[3], addr.from[2]);


*/


var net = require('net');

// parse "80" and "localhost:80" or even "42mEANINg-life.com:80"
var addrRegex = /^(([a-zA-Z\-\.0-9]+):)?(\d+)$/;

console.log(process.env.CLIENTADDRESS);
console.log(process.env.PORT);

var addr = {
    to: addrRegex.exec(process.env.CLIENTADDRESS)
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

