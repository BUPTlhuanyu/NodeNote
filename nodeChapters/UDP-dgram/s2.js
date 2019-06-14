/**
 * Created by liaohuanyu on 2019/4/21.
 * 广播
 */
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const s2msg = Buffer.from('Yes,my name is L')

client.on('message',function(msg, rinfo){
    console.log('from anyonse',msg.toString())
    if(msg.toString() === 'Anyone here?'){
        client.send(s2msg, rinfo.port, rinfo.address, function(err){
            if(err) throw err;
            console.log('over')
        })
    }else{
        client.send(Buffer.from('bye'), rinfo.port, rinfo.address, function(err){
            if(err) throw err;
            console.log('over')
            client.close()
        })
    }
})

client.bind(33333)