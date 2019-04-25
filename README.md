## node everywhere

#### 💡💡💡 一些思考：
- [x] 中间件系统带来的问题，中间件可以随意给ctx定义实例方法以及属性，这样会导致中间件之间的覆盖的问题，很难检查不错误.
      通过在中间件中调用 `await next().catch(err=>console.log(err))`

<details>
<summary>View contents</summary>


<details>
<summary>🍺D1</summary>

- [koa工作原理，实现compose函数来实现AOP](https://github.com/BUPTlhuanyu/NodeNote/blob/master/koa-master/blog/koa%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%EF%BC%8C%E5%AE%9E%E7%8E%B0compose%E5%87%BD%E6%95%B0%E6%9D%A5%E5%AE%9E%E7%8E%B0AOP.md)
</details>

</details>


ToDo

- [x] AOP面向切面编程:面向切面编程（AOP）是一种非侵入式扩充对象、方法和函数行为的技术。通过 AOP 可以从“外部”去增加一些行为，进而合并既有行为或修改既有行为。
- [ ] 内存管理
- [ ] 模板引擎原理
- [x] 中间件实现原理，中间件实现与优化

> 其实本来是想绕开nodejs学一下java做后端web开发的，但是无论对于前端还是前后端同构（ssr并不是必备的，对于那些对首屏加载速度有严格要求，抑或是对产品流量来自搜索的SPA来说ssr是一个不错的选择）
而言目前打包工具webpack是必不可少的。node的学习是理解这些打包工具工作原理的必经之路。因此打算研究一下node以及轻量级web框架koa的实现原理。
这里就先直接跟着前人脚步来学习吧！毕竟一人的见解是不够全面的！

#### 对node的一些理解
非阻塞I/O密集型,事件驱动，单线程 : 对于cpu芯片而言，有vcc，ground，I/O等等引脚，这些I/O上可以连接上许多外设比如鼠标键盘等等功能模块，CPU只专注于控制和运算，node是单线程的是指
node的js执行栈只有一个线程，在这个线程运行的时候遇到I/O操作，比如读取文件，会将这个操作丢给操作系统进行异步处理，node中js执行线程继续执行后面
的代码。当文件读取完成之后会出发一个事件调用对应的回调函数，当然这个回调有可能被阻塞。由于node的单线程特点，因此不适合cpu密集型的项目。一般node
用于做中间代理，作为静态资源服务器，对于那些需要通过复杂计算才能得到数据，一般会转发给API服务器进行处理。因为如果node处理这些请求，那么node会
被这个复杂的计算给阻塞，其他请求进来的时候，客户端会需要等待很长时间。


- [Koa2官网](https://koa.bootcss.com/) ——> [github地址](https://github.com/koajs/koa)
- [Koa.js 设计模式-学习笔记](https://chenshenhai.github.io/koajs-design-note/) ——> [github地址](https://github.com/chenshenhai/koajs-design-note)
- [Koa2进阶学习笔记](https://chenshenhai.github.io/koa2-note/) ——> [github地址](https://github.com/chenshenhai/koa2-note)
