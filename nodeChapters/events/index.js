/**
 * events（事件触发器）
 *
 * 能触发事件的对象： EventEmitter 类的实例
 *
 * EventEmitter 类的原型对象上存在on方法，emit方法
 * eventEmitter.on()：用于将一个或多个函数绑定到命名事件上，即注册监听器
 * eventEmitter.emit()：用于触发事件，触发一个事件时，所有绑定在该事件上的函数都会被同步地调用。
 * 上述逻辑明显是订阅模式，前端路由的实现中也是以这种模式实现的。
 *
 * -----------------------------------------------------
 * 执行监听器的时候，监听器中的this的指向
 * es5普通的函数方法：this指向EventEmitter类的实例（由于订阅模式，因此可以想到调用监听器的对象是EventEmitter 类的实例）
 * es6箭头函数：this指向空定义时的对象，这里是全局中的this，指向module.exports，默认是一个空对象
 *
 * 注意：node中的this件this/this.js文件
 */
const eventEmitter = require('events');
class myEmitter extends eventEmitter{}

let myEvent = new myEmitter();

myEvent.on('e',(a) => {
    console.log(a,this)
    setImmediate(() => {
        console.log('异步进行');
      });
}) // param {}

myEvent.on('e',function fn(a){
    console.log(a,this)
}) // param myEmitter{_events:{e:[...}},_eventsCount:1,_maxListeners:undefined}

myEvent.emit('e','param')
