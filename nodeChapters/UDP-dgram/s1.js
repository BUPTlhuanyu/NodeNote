/**
 * Created by liaohuanyu on 2019/4/21.
 * 广播
 */
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
    console.log(`服务器异常：\n${err.stack}`);
    server.close();
});

const nameMsg = Buffer.from('HaHa')
server.on('message', (msg, rinfo) => {
    console.log(`服务器接收到来自 ${rinfo.address}:${rinfo.port} 的 ${msg.toString()}`);
    if(msg.toString() !== 'bye'){
        server.send(nameMsg, rinfo.port, rinfo.address,function(err){
            if(err) throw err;
            console.log('nameMsg send')
        })
    }else{
        console.log('over')
        server.close()
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`服务器监听 ${address.address}:${address.port}`);
});

/**
 * socket.bind是异步事件
 * 注意，同时监听'listening'事件和在socket.bind()方法中传入callback参数并不会带来坏处，但也不是很有用。
 * 这两者添加的对调函数的执行顺序与注册顺序有关
 */
const msg = Buffer.from('Anyone here?');
const port = 33333;
const host = '255.255.255.255';

server.bind(function(){
    server.setBroadcast(true);
    server.send(msg, port, host, function(err){
        if(err) throw err;
        console.log('msg has been sent');
    });
});