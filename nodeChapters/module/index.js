console.log('main 开始');
const a = require('./a.js');
const b = require('./b.js');
console.log('在 main 中，a.done=%j，b.done=%j', a.done, b.done);

/**
 * 被引入的模块将被缓存在这个对象中。从此对象中删除键值对将会导致下一次 require 重新加载被删除的模块。
 */
console.log(require.cache)
/**
 * 原生require方法会调用mod.require,这个mod.require其实就是调用module.require
 */
console.log("module.require",module.require)
console.log("require",require)
console.log("module",module)
console.log("exports",exports)
console.log("__dirname",__dirname)
console.log("__filename",__filename)
