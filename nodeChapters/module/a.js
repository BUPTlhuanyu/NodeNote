console.log('a 开始');
exports.done = false;
const b = require('./b.js');
console.log('在 a 中，b.done = %j', b.done);
exports.done = true;
console.log('a 结束');

console.log("module.require" ,module.require)
console.log("require" ,require)
console.log("module." ,module)

console.log("exports" ,exports)