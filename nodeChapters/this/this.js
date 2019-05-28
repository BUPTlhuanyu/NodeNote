// https://www.cnblogs.com/pssp/p/5321506.html

// 在全局中的this
console.log(this); //{}
this.num = 10;
console.log(this.num); //10
console.log(global.num); //undefined

// 全局中的this默认是一个空对象。并且在全局中this与global对象没有任何的关系



// 在普通函数中的this
function fn(){
    this.num = 10;
}
fn();
console.log(this); //{}
console.log(this.num); //undefined
console.log(global.num); //10

// 在函数中this指向的是global对象，和全局中的this不是同一个对象，
// 简单来说，你在函数中通过this定义的变量就是相当于给global添加了一个属性，此时与全局中的this已经没有关系了。


// 构造函数中的this:在构造函数中this指向的是它的实例，而不是global。
function Fn(){
    this.num = 998;
}
var fn = new Fn();
console.log(fn.num); // 998
console.log(global.num); // undefined


// 全局中的this指向的是module.exports。

this.num = 10;
console.log(module.exports); //{num:10}
console.log(module.exports.num);