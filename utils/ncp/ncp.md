#### ncp的使用方法

```
var ncp = require('ncp').ncp;
// todo
ncp.limit = 16;
ncp(source, destination, options, callback)
```
> **options.filter : 正则表达式 | function(filename):boolean**

```
filter用于标记需要复制的文件。
正则表达式用于判断文件是否需要复制
函数传入的参数为文件名，返回的boolean为false则表示需要复制，否则不复制当前遍历到的文件。
```

> **options.transform : function (read, write) { read.pipe(write) }**

```
将read文件内容写入write的时候，启用流模式
```

> **options.clobber : boolean**

```
默认为true，表示如果目的文件夹中存在当前文件，会删除该文件，然后复制。否则，直接覆盖该文件
```

> **options.dereference : boolean**

```
默认为false
```

> **options.stopOnErr  : boolean**

```
默认为false，当被设置为ture的时候，复制过程中如果遇到错误会停止复制。如果为false，复制过程中遇到错误会记录日志，并且继续复制其他文件，最后返回一个日志数组。
```

> **options.errs : stream**

```
如果options.stopOnErr为false，会将错误写到这和流中。比如process.stdout打印到命令行
```

> **callback : function(errs){}**

```
处理错误
```

> **options.rename : function(filename;string):string{}**

```
rename为一个函数根据传入的文件名返回一个字符串作为新的文件名
```

#### 源码分析
> **判断文件或者目录是否存在：fs.lstat, err.code === 'ENOENT'**

[常见的系统错误](http://nodejs.cn/api/errors.html#errors_common_system_errors)
```
  /**
   * 
   * @param {*} path 
   * @param {*} done
   * 判断目标路径下，是否已经存在path所示的文件夹，如果不存在则表示可写入调用 done(true)，否则调用 done(false)
   */
  function isWritable(path, done) {
    fs.lstat(path, function (err) {
      if (err) {
        // 常见的系统错误
        // ENOENT (无此文件或目录): 通常是由 fs 操作引起的，表明指定的路径不存在，即给定的路径找不到文件或目录。
        if (err.code === 'ENOENT') return done(true);
        return done(false);
      }
      return done(false);
    });
  }
```

> **创建符号链接： fs.symlink**


```
    fs.symlink(linkPath, target, function (err) {
      if (err) {
        return onError(err);
      }
      return cb();
    });
```

> **读取符号链接：fs.readlink**


```
    fs.readlink(link, function (err, resolvedPath) {
      if (err) {
        return onError(err);
      }
      ...
    });
```

> **读取目录：fs.readdir**


```
    fs.readdir(dir, function (err, items) {
      if (err) {
        return onError(err);
      }
      // 逐一复制dir目录下的文件到targetPath
      items.forEach(function (item) {
        startCopy(path.join(dir, item));
      });
      // 复制完成之后执行cb() 
      return cb();
    });
```

> **创建目录：fs.mkdir**


```
    fs.mkdir(target, dir.mode, function (err) {
      if (err) {
        return onError(err);
      }
        ...
    });
```

> **异步地删除文件或符号链接：fs.unlink**


```
    fs.unlink(file, function (err) {
      if (err) {
        return onError(err);
      }
      ...
    });
```

> **同步设置文件系统时间戳：fs.utimesSync**

```
atime:上次访问此文件的时间戳
mtime:上次修改此文件的时间戳

fs.utimesSync(target, atime, mtime);
```

#### 核心模块：fs与path

---
#### fs.link与fs.symlink的区别
这两者的区别也就是linux下link()与symlink()的区别，link()创建的是一个硬链接，symlink()创建的是一个符号连接。fs.readlik只能用于读取符号链接，Linux系统中的readlink是一个常用工具，主要用来找出符号链接所指向的位置。

#### 文件的索引节点号inode
在Linux的文件系统中，保存在磁盘分区中的文件不管是什么类型都给它分配一个编号，称为索引节点号inode 。
> 用户数据 (user data) 与元数据 (metadata)。用户数据，即文件数据块 (data block)，数据块是记录文件真实内容的地方；而元数据则是文件的附加属性，如文件大小、创建时间、所有者等信息。在 Linux 中，元数据中的 inode 号（inode 是文件元数据的一部分但其并不包含文件名，inode 号即索引节点号）才是文件的唯一标识而非文件名。文件名仅是为了方便人们的记忆和使用，系统或程序通过 inode 号寻找正确的文件数据块。

#### 符号连接与硬链接的区别
- [参考](https://www.cnblogs.com/wendyy/p/9324181.html)

> linux系统系的符号连接类似windows下的快捷方式。

> 硬链接实际上是为文件建一个别名，链接文件和原文件实际上是同一个文件。可以通过ls -i来查看一下，这两个文件的inode号是同一个，说明它们是同一个文件；而软链接建立的是一个指向，即链接文件内的内容是指向原文件的指针，它们是两个文件。


---
> **绝对路径：path.isAbsolute(path)**

path.isAbsolute() 方法检测 path 是否为绝对路径。如果给定的 path 是零长度字符串，则返回 false。


```
POSIX 上：
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false

Windows 上：
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
可以看到这里判断绝对路径是根据路径前是否有斜杠或者反斜杠或者有`盘符:\\`。


> **path.resolve**

path.resolve() 方法将路径或路径片段的序列解析为绝对路径。给定的路径序列从右到左进行处理，每个后续的 path 前置，直到构造出一个绝对路径。

例如，给定的路径片段序列：/foo、 /bar、 baz，调用 path.resolve('/foo', '/bar', 'baz') 将返回 /bar/baz。

如果在处理完所有给定的 path 片段之后还未生成绝对路径，则再加上当前工作目录。
```
1、不带参数时
path.resolve()  返回的是当前的文件的绝对路径/Users/xxxx/
2、带不是/开头的参数
path.resolve('a')  返回的是当前绝对路径拼接现在的参数/Users/xxxx/a
path.resolve('a'，'b')  返回的是当前绝对路径拼接现在的参数/Users/xxxx/a/b
3、带./开头的参数
path.resolve('./a')  返回的是当前绝对路径拼接现在的参数/Users/xxxx/a
path.resolve('./a','./b')  返回的是当前绝对路径拼接现在的参数/Users/xxxx/a/b
4、带/开头的参数  返回的是    /+‘最后一个前面加/的文件文件名’+‘剩下文件夹
path.resolve('/a')  返回的是当前绝对路径拼接现在的参数/a
path.resolve('/a'，'/b')  返回的是当前绝对路径拼接现在的参数/b
path.resolve('/a'，'/b', 'c')  返回的是当前绝对路径拼接现在的参数/b/c
```

> **path.join**

path.join() 方法使用平台特定的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。

```
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
```

> **path.join 与 path.resolve的区别**

1. 对于以/开始的路径片段，path.join只是简单的将该路径片段进行拼接，而path.resolve将以/开始的路径片段作为根目录，在此之前的路径将会被丢弃，就像是在terminal中使用cd命令一样。
    ```
    path.join('/a', '/b') // 'a/b'
    path.resolve('/a', '/b') // '/b'
    ```
2. path.resolve总是返回一个以相对于当前的工作目录（working directory）的绝对路径。
    ```
    path.join('./a', './b') // 'a/b'
    path.resolve('./a', './b') // '/Users/username/Projects/webpack-demo/a/b'
    ```