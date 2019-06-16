const http = require('http');

let server = http.createServer(function(req, res) {

    console.log(req.connection.remotePort);
    res.end('200');

}).listen(9990);

server.keepAliveTimeout = 5000; // 这个值默认就是5s,可以直接赋值修改