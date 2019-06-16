/**
 * Created by liaohuanyu on 2019/4/21.
 * tcp的半关闭状态，socket一端调用end，另一端只能写，读无效；当前端只能读，写无效
 * 
 * server事件：
        1:listening: 在调用sever.listen()绑定端口或者Domain Socket后触发，简洁写法为server.listen（por,listeningListener），通过listen()方法的第二个参数传入。 
        2.connection: 每个客户端套接字连接到服务器端时触发 
        3.close： 当服务器关闭时触发，在调用server.close（）后，服务器将停止接受新的套接字连接，但保持当前存在的连接，等待所有连接都断开后，会触发该事件。 
        4.error： 当服务器发生异常时，会触发该事件。
 */
var net = require('net');

var server = net.createServer({allowHalfOpen:true},function(socket){
    socket.on('data',function(data){
        console.log(data.toString())
        socket.write('你好');
    });
    socket.on('end',function(){
        console.log('链接断开,allowHalfOpen为true，不能读但是能写')
        socket.write('allowHalfOpen')
    })
    socket.write('示例')
})

server.listen(8124,function(){
    console.log('server bound')
})