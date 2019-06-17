/**
 * dns.lookup()跟dns.resolve4()的区别
 * 最大的差异就在于，当配置了本地Host时，是否会对查询结果产生影响
 *  dns.lookup()：有影响。
    dns.resolve4()：没有影响。
    https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/dns.md

    在hosts文件里配置   127.0.0.1 www.qq.com

    var dns = require('dns');

    dns.lookup('www.qq.com', function(err, address, family){
        if(err) throw err;
        console.log('配置host后，dns.lokup =>' + address); //配置host后，dns.resolve4 =>182.254.34.74
    });

    dns.resolve4('www.qq.com', function(err, address, family){
        if(err) throw err;
        console.log('配置host后，dns.resolve4 =>' + address);   //配置host后，dns.lookup =>127.0.0.1
    });
 */



const dns = require('dns')

dns.lookupService('127.0.0.1',3009,(err, hostname, service) => {
    if(err) throw err;
    console.log('hostname',hostname);
    console.log('service',service)
})

// A记录（主机名解析）是最普通的域名解析，是把某一主机名解析到一个IP。
dns.resolve('localhost',(err, address) => {
    if(err) throw err;
    console.log('address',address);
})

dns.resolve4('localhost',{ ttl:true }, (err, address) => {
    if(err) throw err;
    console.log('address',address);
})

// 返回不同类型的dns解析结果，例如
// [ { type: 'A', address: '127.0.0.1', ttl: 299 },
//   { type: 'CNAME', value: 'example.com' },
//   { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
//   { type: 'NS', value: 'ns1.example.com' },
//   { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
//   { type: 'SOA',
//     nsname: 'ns1.example.com',
//     hostmaster: 'admin.example.com',
//     serial: 156696742,
//     refresh: 900,
//     retry: 900,
//     expire: 1800,
//     minttl: 60 } ]
dns.resolveAny('localhost', (err, ret) => {
    if(err) throw err;
    console.log('ret',ret);
})

// CNAME（别名解析）是主机名到主机名的映射，是把某一主机名解析到另一个主机名。
dns.resolveCname('www.baidu.com', (err, addresses) => {
    if(err) throw err;
    console.log('addresses',addresses);
})


// 反向查询
dns.reverse('127.0.0.1',(err, hostname) =>{
    if(err) throw err;
    console.log('反向查询',hostname)
})


