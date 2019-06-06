console.log('main 开始');
const a = require('./a.js');
const b = require('./b.js');
console.log('在 main 中，a.done=%j，b.done=%j', a.done, b.done);


console.log(require.cache)

// console.log("require",require)
// console.log("module",module)
// console.log("exports",exports)
// console.log("__dirname",__dirname)
// console.log("__filename",__filename)
