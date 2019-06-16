/**
 * Created by liaohuanyu on 2019/4/21.
 * socket的事件：
        1.data: 当一端调用write()发送数据时，另一端会触发data事件，事件传递的数据时write()发送的数据。
        2.end: 当连接中的任意一端发送了FIN数据时，将会触发该事件。 
        3.connect： 该事件用于客户端，当套接字与服务器连接成功时会被触发。 
        4.drain： 当任意一端调用write( )发送数据时，当前这端会触发该事件。 
        5.error： 当异常发生时，会触发该事件。 
        6.close： 当套接字完全关闭时，触发该事件。 
        7timeout： 当一定时间后连接不在活跃时，会被触发，通知用户当前该连接已经被闲置。 
        由于TCP套接字是可读可写的Stream对象，可以利用pipe()方法实现管道操作。 
 */

var net = require('net');
var client = net.connect({port:8124},function(){
    console.log(client)
    client.write('world!')
});
client.on('data',function(data){
    console.log(data.toString());
    // end会使得当前socket处于半关闭状态，不能主动写数据到服务端
    client.end();
});
client.on('end',function(){
    console.log('client disconnected');
    // 此时socket处于半关闭状态，只能读不能写
    client.write('can?')
})


var client1 = net.connect({port:8124},function(){
    console.log(client1)
    client1.write('world!')
});
client1.on('data',function(data){
    console.log(data.toString());
    // end会使得当前socket处于半关闭状态，不能主动写数据到服务端
    client1.end();
});
client1.on('end',function(){
    console.log('client disconnected');
    // 此时socket处于半关闭状态，只能读不能写
    client1.write('can?')
})