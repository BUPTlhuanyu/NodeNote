/**
 * Created by lhy on 2019/4/2.
 */
module.exports = compose

function compose (middleware) {
    //传入的必须是一个数组，数组中每个元素必须都是函数
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }

    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */
    //返回一个洋葱模型的入口函数
    return function (context, next) {
        // last called middleware #
        let index = -1
        return dispatch(0)
        function dispatch (i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = middleware[i]
            if (i === middleware.length) fn = next
            if (!fn) return Promise.resolve()
            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}

function myCompose(ctx = [],middleware){
    let index = -1;
    return dispatch(0)
    function dispatch(i){
        if(i <= index) return Promise.reject(new Error('next() called multiple times in a middleware'));
        index = i;
        let fn = middleware[i];
        if(!fn) return Promise.resolve();
        try {
            return Promise.resolve(fn(ctx, dispatch.bind(null,i+1)));
        } catch(err){
            return Promise.reject(err)
        }
    }
}

let fn0 = async function(ctx,next){
    console.log(0);
    ctx.push(0)
    await next()
    console.log("fn0");
}

let fn1 = async function(ctx,next){
    console.log(1);
    ctx.push(1)
    await next();
    console.log("fn1");
}

let fn2 = async function(ctx,next){
    console.log(2);
    ctx.push(2)
    await next();
    console.log("fn2");
}

let middleware = [fn0,fn1,fn2]
let ctx = []
myCompose(ctx,middleware);
console.log(ctx);