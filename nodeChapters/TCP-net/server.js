/**
 * Created by liaohuanyu on 2019/4/21.
 */
var net = require('TCP-net');

var server = net.createServer(function(socket){
    socket.on('data',function(data){
        console.log(data.toString())
        socket.write('你好');
    });
    socket.on('end',function(){
        console.log('链接断开')
    })
    socket.write('示例')
})

server.listen(8124,function(){
    console.log('server bound')
})