//摘抄自
//https://juejin.im/post/5c32e0c86fb9a049e7024432#heading-3

'use strict';

/**
 * Module dependencies.
 */

const isGeneratorFunction = require('is-generator-function');
const debug = require('debug')('koa:application');
const onFinished = require('on-finished');
const response = require('./response');
const compose = require('koa-compose');
const isJSON = require('koa-is-json');
const context = require('./context');
const request = require('./request');
const statuses = require('statuses');
const Emitter = require('events');
const util = require('util');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const convert = require('koa-convert');
const deprecate = require('depd')('koa');

/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */
//koa继承自Emitter，能触发事件的对象

module.exports = class Application extends Emitter {
  /**
   * Initialize a new `Application`.
   *
   * @api public
   */

  constructor() {
    super();

    //表示是否开启代理,默认为false,如果开启代理，对于获取request请求中的host，protocol，ip
    // 分别优先从Header字段中的X-Forwarded-Host，X-Forwarded-Proto，X-Forwarded-For获取。
    this.proxy = false;
    //最重要的一个属性，存放所有的中间件，存放和执行的过程后文细说。
    this.middleware = [];
    //子域名的偏移量，默认值为2，这个参数决定了request.subdomains的返回结果。
    this.subdomainOffset = 2;
    //node的执行环境， 默认是development。
    this.env = process.env.NODE_ENV || 'development';
    //中间件第一个实参ctx的原型, 具体在讲context.js时会说到。
    this.context = Object.create(context);
    // ctx.request的原型，定义在request.js中。
    this.request = Object.create(request);
    //ctx.response的原型，定义在response.js中。
    this.response = Object.create(response);
    //util.inspect这个方法用于将对象转换为字符串，
    // 在node v6.6.0及以上版本中util.inspect.custom是一个Symbol类型的值，
    // 通过定义对象的[util.inspect.custom]属性为一个函数，可以覆盖util.inspect的默认行为。
    // http://nodejs.cn/api/util.html#util_util_inspect_custom
    // 当log一个对象的时候，会调用对象上的[Symbol.for('nodejs.util.inspect.custom')]方法
    // 主要作用输出对象的描述信息
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }

  /**
   * Shorthand for:
   *
   *    http.createServer(app.callback()).listen(...)
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   */
  //传入的参数可以是多个地址，返回的server会同时监听这些端口？？？
  //通过原生的http模块创建服务器并监听的，请求事件触发时调用的回调函数是callback函数的返回值。
  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  /**
   * Return JSON representation.
   * We only bother showing settings.
   *
   * @return {Object}
   * @api public
   */

  toJSON() {
    return only(this, [
      'subdomainOffset',
      'proxy',
      'env'
    ]);
  }

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  inspect() {
    return this.toJSON();
  }

  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  // use方法很简单，接受一个函数作为参数，并加入middleware数组。
  // 由于koa最开始支持使用generator函数作为中间件使用，但将在3.x的版本中放弃这项支持，
  // 因此koa2中对于使用generator函数作为中间件的行为给与未来将被废弃的警告，
  // 但会将generator函数转化为async函数。返回this便于链式调用。
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
  }

  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */
  // koa继承自Emitter,因此可以通过listenerCount属性判断监听了多少个error事件，
  // 如果外部没有进行监听，框架将自动监听一个error事件。
  // callback函数返回一个handleRequest函数，因此真正的请求处理回调函数是handleRequest。
  // 在handleRequest函数内部，通过createContext创建了上下文ctx，并交给koa实例的handleRequest方法去处理回调逻辑。

  callback() {
    //compose函数将中间件数组转换成执行链函数fn
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  /**
   * Initialize a new context.
   *
   * @api private
   */

  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }
};

/**
 * Response helper.
 */

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  if (!ctx.writable) return;

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
