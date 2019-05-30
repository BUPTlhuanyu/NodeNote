/**
 * Buffer.alloc、Buffer.allocUnsafe、Buffer.allocUnsafeSlow之间的区别
 * 
 *  Buffer.alloc会用0值填充已分配的内存，所以相比后两者速度上要慢，但是也较为安全。
    当然也可以通过--zero-fill-buffers flag使allocUnsafe、allocUnsafeSlow在分配完内存后也进行0值填充。
        `node --zero-fill-buffers index.js`

    uffer.allocUnsafe、Buffer.allocUnsafeSlow:

    当分配的空间小于4KB的时候，allocUnsafe会直接从之前预分配的Buffer里面slice空间，因此速度比allocUnsafeSlow要快
    当大于等于4KB的时候二者速度相差无异。
 */

function createBuffer(fn, size) {
    console.time('buf-' + fn);
    for (var i = 0; i < 100000; i++) {
      Buffer[fn](size);
    }
    console.timeEnd('buf-' + fn);
  }
  // 分配空间等于4KB
  createBuffer('alloc', 4096);
  createBuffer('allocUnsafe', 4096);
  createBuffer('allocUnsafeSlow', 4096);
  // 分配空间小于4KB
  createBuffer('alloc', 4095);
  createBuffer('allocUnsafe', 4095);
  createBuffer('allocUnsafeSlow', 4095);

//   转换成JSON
  const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
  console.log(buf.toJSON());

/**
 * 将字符串转换为Buffer对象，再发给客户端
 * 
 * 在NodeJS中，进行http传输时，若返回的类型为string，则会将string类型的参数，转换为Buffer，
 * 通过NodeJS中的Stream流，一点点的返回给客户端。如果我们直接返回Buffer类型，就没有了转换操作，
 * 直接返回，减少了CPU的重复使用率。
 * 
 * 返回string时，每次请求都需要将string装换成Buffer返回；而直接返回Buffer时，这个Buffer是我们启动服务时就存放在内存中的，
 * 每次请求直接返回内存中的Buffer即可，因此Buffer使用前后QPS提升了很多。
 * 
 * 1、部分资源可以预先转换为Buffer类型（如js、css等静态资源文件），直接返回buffer给客户端，
 * 2、文件转发的场景，将获取到的内容储存为Buffer直接转发，避免额外的转换操作。
 */
const http = require('http');

let hello = ''
for (var i = 0; i < 10240; i++) {
  hello += "a";
}

console.log(`Hello：${hello.length}`)
// 这里将字符串转换成buffer对象能提升后端服务的性能
// hello = Buffer.from(hello);

http.createServer((req, res) => {
  res.writeHead(200);
  res.end(hello);
}).listen(8001);



