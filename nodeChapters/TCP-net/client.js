/**
 * Created by liaohuanyu on 2019/4/21.
 */
var net = require('TCP-net');
var client = net.connect({port:8124},function(){
    console.log('client connected');
    client.write('world!')
});
client.on('data',function(data){
    console.log(data.toString());
    client.end();
});
client.on('end',function(){
    console.log('client disconnected');
})