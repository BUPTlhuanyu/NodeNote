## node everywhere

> 其实本来是想绕开nodejs学一下java做后端web开发的，但是无论对于前端还是前后端同构（ssr并不是必备的，对于那些对首屏加载速度有严格要求，抑或是对产品流量来自搜索的SPA来说ssr是一个不错的选择）
而言目前打包工具webpack是必不可少的。node的学习是理解这些打包工具工作原理的必经之路。因此打算研究一下node以及轻量级web框架koa的实现原理。
这里就先直接跟着前人脚步来学习吧！毕竟一人的见解是不够全面的！

#### 对node的一些理解
        - 非阻塞I/O密集型,事件驱动，单线程
            对于cpu芯片而言，有vcc，ground，I/O等等引脚，这些I/O上可以连接上许多外设比如鼠标键盘等等功能模块，CPU只专注于控制和运算，node是单线程的是指
            node的js执行栈只有一个线程，在这个线程运行的时候遇到I/O操作，比如读取文件，会将这个操作丢给操作系统进行异步处理，node中js执行线程继续执行后面
            的代码。当文件读取完成之后会出发一个事件调用对应的回调函数，当然这个回调有可能被阻塞。由于node的单线程特点，因此不适合cpu密集型的项目。一般node
            用于做中间代理，作为静态资源服务器，对于那些需要通过复杂计算才能得到数据，一般会转发给API服务器进行处理。因为如果node处理这些请求，那么node会
            被这个复杂的计算给阻塞，其他请求进来的时候，客户端会需要等待很长时间。

> [Koa2官网](https://koa.bootcss.com/) ——> [github地址](https://github.com/koajs/koa)

> [Koa.js 设计模式-学习笔记](https://chenshenhai.github.io/koajs-design-note/) ——> [github地址](https://github.com/chenshenhai/koajs-design-note)

在编写级联的中间件的时候，比如：

    const Koa = require('koa');
    const app = new Koa();

    // logger

    app.use(async (ctx, next) => {
      await next();
      const rt = ctx.response.get('X-Response-Time');
      console.log(`${ctx.method} ${ctx.url} - ${rt}`);
    });

    // x-response-time

    app.use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      ctx.set('X-Response-Time', `${ms}ms`);
    });

    // response

    app.use(async ctx => {
      ctx.body = 'Hello World';
    });

    app.listen(3000);

这里中间件级联的方式对ctx进行逐步处理，根据compose.js可知传入中间件的next其实就是：

    dispatch.bind(null, i + 1)

具体工作原理：

1、创建一个koa对象，然后调用use(fn)将fn push到该koa对象的中间件数组中，

2、接着调用listen创建一个服务器容器，然后调用this.callback()，然后监听指定端口

3、this.callback()首先会调用compose对中间件数组进行处理，返回一个洋葱模型的入口函数。然后返回一个handleRequest

4、handleRequest函数会在监听到端口有请求的时候调用，该函数最终会调用洋葱模型的入口函数。

5、handleRequest函数接收两个参数req, res；该函数执行的时候首先会根据传入的req, res创建一个ctx；然后调用koa对象的handleRequest函数，将结果返回。

6、koa对象的handleRequest函数接收两个参数(ctx, fn)，ctx就是根据req, res创建的ctx，fn就是调用compose返回的洋葱模型入口函数。
   koa对象的handleRequest函数最终会调用fn(ctx)

在中间件需要级联的时候，需要给中间件传入第二个参数next


ToDo

- [ ] AOP面向切面编程:面向切面编程（AOP）是一种非侵入式扩充对象、方法和函数行为的技术。通过 AOP 可以从“外部”去增加一些行为，进而合并既有行为或修改既有行为。
- [ ] IOC???
- [ ] 内存管理process.memoryUsage

> [Koa2进阶学习笔记](https://chenshenhai.github.io/koa2-note/) ——> [github地址](https://github.com/chenshenhai/koa2-note)