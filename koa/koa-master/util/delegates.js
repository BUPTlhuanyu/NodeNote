/**
 * Created by liaohuanyu on 2019/4/2.
 */
// Delegator(proto, 'response')
//     .method('attachment')
//上述代码的作用就是，将proto[attachment]()代理为执行proto[response][attachment]()

// Delegator(proto, 'response')的最终的作用就是将proto上的所有方法或者属性代理到proto[response]上对应的位置。
// 也就是说proto上的属性以及方法名称一定能在proto[response]上找到。

function Delegator(proto, target) {
    if (!(this instanceof Delegator)) return new Delegator(proto, target);
    this.proto = proto;
    this.target = target;
    this.methods = [];
    this.getters = [];
    this.setters = [];
    this.fluents = [];
}

/**
 * Automatically delegate properties
 * from a target prototype
 *
 * @param {Object} proto
 * @param {object} targetProto
 * @param {String} targetProp
 * @api public
 */

Delegator.auto = function(proto, targetProto, targetProp){
    var delegator = Delegator(proto, targetProp);
    var properties = Object.getOwnPropertyNames(targetProto);
    for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        var descriptor = Object.getOwnPropertyDescriptor(targetProto, property);
        if (descriptor.get) {
            delegator.getter(property);
        }
        if (descriptor.set) {
            delegator.setter(property);
        }
        if (descriptor.hasOwnProperty('value')) { // could be undefined but writable
            var value = descriptor.value;
            if (value instanceof Function) {
                delegator.method(property);
            } else {
                delegator.getter(property);
            }
            if (descriptor.writable) {
                delegator.setter(property);
            }
        }
    }
};

/**
 * Delegate method `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */
//返回Delegator对象
//给this.proto上添加一个方法名为name的方法,
// 调用proto[name]的时候实际上是调用this[target][name]
Delegator.prototype.method = function(name){
    var proto = this.proto;
    var target = this.target;
    this.methods.push(name);

    proto[name] = function(){
        //执行proto[name]()的时候，这里的this指向proto
        //在koa中执行context.redirect的时候，相当于执行context.response.redirect,也就是response.redirect
        //因为在createContext中const response = context.response = Object.create(this.response);
        return this[target][name].apply(this[target], arguments);
    };

    return this;
};

/**
 * Delegator accessor `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */
// 获取proto[name]以及给proto[name]赋值的时候进行拦截，
// 分别返回调用this[target][name]以及this[target][name] = val的结果
Delegator.prototype.access = function(name){
    return this.getter(name).setter(name);
};

/**
 * Delegator getter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */
//proto.__defineGetter__：获取proto[name]的时候，会调用第二个参数所示的函数
Delegator.prototype.getter = function(name){
    var proto = this.proto;
    var target = this.target;
    this.getters.push(name);

    proto.__defineGetter__(name, function(){
        return this[target][name];
    });

    return this;
};

/**
 * Delegator setter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */
//proto.__defineSetter__：在给proto[name]赋值的时候，会调用第二个参数所示的函数进行赋值
Delegator.prototype.setter = function(name){
    var proto = this.proto;
    var target = this.target;
    this.setters.push(name);

    proto.__defineSetter__(name, function(val){
        return this[target][name] = val;
    });

    return this;
};

/**
 * Delegator fluent accessor
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.fluent = function (name) {
    var proto = this.proto;
    var target = this.target;
    this.fluents.push(name);

    proto[name] = function(val){
        if ('undefined' != typeof val) {
            this[target][name] = val;
            return this;
        } else {
            return this[target][name];
        }
    };

    return this;
};