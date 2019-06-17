const http = require('http');

const agent = new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 20000,
    maxSockets: 4,
    maxFreeSockets: 2
});

const test = () => {
    return new Promise((resolve, reject) => {
        const option = {
            protocol: 'http:',
            host: 'localhost',
            port: 9990,
            path: `/`,
            agent: agent,
            // agent: agent,
            headers: {"Connection": "keep-alive"},
            method: 'GET'
        };


        const req = http.request(option, function(res) {
            const ip = req.socket.localAddress;
            const port = req.socket.localPort;
            console.log(`您的 IP 地址是 ${ip}，源端口是 ${port}`);
            res.setEncoding('utf8');
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                resolve(body)
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            console.log(e.stack)
        });


        req.end();
    })
};




const sendReq = (count) => {
    let arr = [];
    for (let i=0;i<count;i++) arr.push(test())
    Promise.all(arr).then(function(){
        console.log('======end======')
    })
}

sendReq(1);  // 先发送一个req

setTimeout(() => {sendReq(1)}, 10 * 1000); //隔10s后再次发送一次req