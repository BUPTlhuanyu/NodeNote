/**
 * Created by liaohuanyu on 2019/5/15.
 */
// IO饿死的原因：
// 在事件循环每个阶段之前(处理定时器队列，IO 事件队列，immediates 队列，close 事件处理队列是四个主要的事件处理阶段)，
// 也就是在移动到下一个阶段前，Node 会检查 nextTick 队列是否有待处理的函数。
// 如果有，那么 Node 将会立即开始处理队列中的函数，直到队列为空，在每次准备移动到下一个事件循环阶段都会进行这样的处理。

// 这样带来了一个新的问题。如果我们不断地递归地使用 process.nextTick 将回调函数添加到 nextTick 队列中，
// 将会引起 I/O 和其他队列永远不会被处理执行。我们可以通过下面这个简单的脚本来模拟这样的情况：
//             const fs = require('fs');
//
//             function addNextTickRecurs(count) {
//                 let self = this;
//                 if (self.id === undefined) {
//                     self.id = 0;
//                 }
//
//                 if (self.id === count) return;
//
//                 process.nextTick(() => {
//                     console.log(`process nextTick call ${++self.id}`);
//                     addNextTickRecurs.call(self, count);
//                 });
//             }
//
//             addNextTickRecurs(Infinity);
//             setTimeout(console.log.bind(console, 'omg! setTimeout was called'), 10);
//             setImmediate(console.log.bind(console, 'omg! setImmediate also was called'));
//             fs.readFile(__filename, () => {
//                 console.log('omg! file read complete callback was called');
//             });
//
//             console.log('started');

// 每个阶段之前：
// 检查是否有 process.nextTick 任务，如果有，全部执行。
// 检查是否有microtask，如果有，全部执行。
// microtask中如果有process.nextTick任务添加，则在microtask执行完之后还会立即执行nextTick 任务
// 如果这个process.nextTick中又添加了一个microtask任务，会在nextTick执行完之后，执行所有的microtask
Promise.resolve().then(() => console.log('promise1 resolved'));
Promise.resolve().then(() => console.log('promise2 resolved'));
Promise.resolve().then(() => {
    console.log('promise3 resolved');
    process.nextTick(() => {
        console.log('next tick AAA inside promise resolve handler')
        Promise.resolve().then(() => console.log('promise resolved in next tick AAA'));
    });
});
Promise.resolve().then(() => console.log('promise4 resolved'));
Promise.resolve().then(() => console.log('promise5 resolved'));
setImmediate(() => console.log('set immedaite1'));
setImmediate(() => console.log('set immediate2'));

process.nextTick(() => console.log('next tick1'));
process.nextTick(() => console.log('next tick2'));
process.nextTick(() => console.log('next tick3'));

setTimeout(() => console.log('set timeout'), 0);
setImmediate(() => console.log('set immediate3'));
setImmediate(() => console.log('set immediate4'));