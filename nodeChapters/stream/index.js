const { PassThrough, Writable } = require('stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing 现在为 false。

pass.on('data', (chunk) => { console.log(chunk.toString()); });
pass.on('readable', (chunk) => { console.log(chunk.toString()); });
pass.removeAllListeners('readable');
pass.write('ok'); // 不会触发 'data' 事件。
// pass.resume(); // 必须调用它才会触发 'data' 事件。