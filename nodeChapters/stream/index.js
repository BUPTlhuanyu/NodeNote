/**
 * 调用 readable.pause()、 readable.unpipe()、或接收到背压，则 readable.readableFlowing 会被设为 false，暂时停止事件流动但不会停止数据的生成。 
 * 在这个状态下，为 'data' 事件绑定监听器不会使 readable.readableFlowing 切换到 true。
 */
const { PassThrough, Writable } = require('stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing 现在为 false。

pass.on('data', (chunk) => { console.log(chunk.toString()); });
pass.write('ok'); // 不会触发 'data' 事件。
// pass.resume(); // 必须调用它才会触发 'data' 事件。

/**
 * 如果同时使用 'readable' 事件和 'data' 事件，则 'readable' 事件会优先控制流，也就是说，当调用 stream.read() 时才会触发 'data' 事件。 
 * readableFlowing 属性会变成 false。
 * 当移除 'readable' 事件时，如果存在 'data' 事件监听器，则流会开始流动，也就是说，无需调用 .resume() 也会触发 'data' 事件。
 */
const pass1 = new PassThrough();
const writable1 = new Writable();

pass1.pipe(writable1);
pass1.unpipe(writable1);
// readableFlowing 现在为 false。

pass1.on('data', (chunk) => { console.log(chunk.toString()); });
pass1.on('readable', (chunk) => { console.log(chunk.toString()); });
pass1.removeAllListeners('readable');
pass1.write('ok'); // 不会触发 'data' 事件。