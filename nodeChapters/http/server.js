// 在服务端的response事件获得的socket.localport表示的是服务端挂载的端口号，在传输层也就是tcp服务器这一端的端口号；
// socket.remoteport表示的是客户端的端口号，在传输层也就是tcp客户端这一端的端口号；
// socket是会话层抽象出来的接口，处于tcp传输层与http应用层之间。
// socket相当于一个管道连接两个端口，具备两个属性localport与remoteport，并且在客户端和服务端具有不同的值。

const http = require('http');

let server = http.createServer(function(req, res) {

    // 这个socket是net.socket
    // 在服务端获取到的localPort表示服务端挂载的端口号
    // remotePort表示net.socket另外一头的端口号
    console.log(req.connection.remotePort);
    console.log(req.connection.localPort);
    res.end('200');

}).listen(9990);

server.keepAliveTimeout = 5000; // 这个值默认就是5s,可以直接赋值修改