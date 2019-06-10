var fs = require('fs'),
    path = require('path');

module.exports = ncp;
ncp.ncp = ncp;

function ncp (source, dest, options, callback) {
    // 四个参数都存在的情况下，将第四个参数存入内部变量cback
  var cback = callback;

//   不管输入是什么，如果第四个参数不存在，则将第三个参数作为callback，options为空对象
  if (!callback) {
    cback = options;
    options = {};
  }

  var basePath = process.cwd(),//当前路径
      currentPath = path.resolve(basePath, source),//从当前路径开始，找到source对应的绝对路径
      targetPath = path.resolve(basePath, dest),//从当前路径开始，找到dest对应的绝对路径
      filter = options.filter,
      rename = options.rename,
      transform = options.transform,
      clobber = options.clobber !== false,
      modified = options.modified,
      dereference = options.dereference,
      errs = null,
      started = 0,
      finished = 0,
      running = 0,
      limit = options.limit || ncp.limit || 16;

  limit = (limit < 1) ? 1 : (limit > 512) ? 512 : limit;

  startCopy(currentPath);
  
  function startCopy(source) {
    started++;
    if (filter) {
      if (filter instanceof RegExp) {
        if (!filter.test(source)) {
          // 正则表达式匹配的路径是需要复制的文件，匹配结果为false则不需要复制
          return cb(true);
        }
      }
      else if (typeof filter === 'function') {
        if (!filter(source)) {
          // 返回的boolean为false则表示该文件不需要复制
          return cb(true);
        }
      }
    }
    // 如果不存在filter，或者当前文件不需要滤除，则开始拷贝
    return getStats(source);
  }

  function getStats(source) {
    var stat = dereference ? fs.stat : fs.lstat;
    if (running >= limit) {
      return setImmediate(function () {
        getStats(source);
      });
    }
    running++;
    stat(source, function (err, stats) {
      var item = {};
      if (err) {
        return onError(err);
      }

      // We need to get the mode from the stats object and preserve it.
      item.name = source;
      item.mode = stats.mode;
      item.mtime = stats.mtime; //modified time
      item.atime = stats.atime; //access time

      if (stats.isDirectory()) {
        return onDir(item);
      }
      else if (stats.isFile()) {
        return onFile(item);
      }
      else if (stats.isSymbolicLink()) {
        // Symlinks don't really need to know about the mode.
        return onLink(source);
      }
    });
  }

  function onFile(file) {
    // a/???/t.js的文件
    var target = file.name.replace(currentPath, targetPath);
    if(rename) {
      target =  rename(target);
    }
    isWritable(target, function (writable) {
      if (writable) {
        return copyFile(file, target);
      }
      if(clobber) {
        // 先删除后复制
        rmFile(target, function () {
          copyFile(file, target);
        });
      }
      if (modified) {
        // modified为true，会判断复制过程中原文件如果有修改则再复制一次
        var stat = dereference ? fs.stat : fs.lstat;
        stat(target, function(err, stats) {
            //if souce modified time greater to target modified time copy file
            if (file.mtime.getTime()>stats.mtime.getTime())
                copyFile(file, target);
            else return cb();
        });
      }
      else {
        return cb();
      }
    });
  }

  function copyFile(file, target) {
    var readStream = fs.createReadStream(file.name),
        writeStream = fs.createWriteStream(target, { mode: file.mode });
    
    readStream.on('error', onError);
    writeStream.on('error', onError);
    
    if(transform) {
      transform(readStream, writeStream, file);
    } else {
      writeStream.on('open', function() {
        readStream.pipe(writeStream);
      });
    }
    writeStream.once('finish', function() {
        if (modified) {
            //target file modified date sync.
            fs.utimesSync(target, file.atime, file.mtime);
            cb();
        }
        else cb();
    });
  }

  function rmFile(file, done) {
    // 异步地删除文件或符号链接。
    fs.unlink(file, function (err) {
      if (err) {
        return onError(err);
      }
      return done();
    });
  }

  function onDir(dir) {
    // 替换文件夹的当前位置到目标位置
    var target = dir.name.replace(currentPath, targetPath);
    // 判断目标路径下是否已经存在target所示的文件夹，如果不存在则writable为true，表示可以直接创建文件夹
    // 否则调用copyDir复制这个文件夹下内容到目标路径
    isWritable(target, function (writable) {
      if (writable) {
        return mkDir(dir, target);
      }
      copyDir(dir.name);
    });
  }

  /**
   * 
   * @param {*} dir 路径from
   * @param {*} target 路径to
   * 按照dir文件的属性，创建 target 目录
   */
  function mkDir(dir, target) {
    fs.mkdir(target, dir.mode, function (err) {
      if (err) {
        return onError(err);
      }
      // 创建完成后，如果没有错误，执行copyDir开始复制目录下的文件
      copyDir(dir.name);
    });
  }

  /**
   * 
   * @param {*} dir 
   * 逐一复制dir目录下的文件到targetPath
   */
  function copyDir(dir) {
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
  }

  function onLink(link) {
    var target = link.replace(currentPath, targetPath);
    fs.readlink(link, function (err, resolvedPath) {
      if (err) {
        return onError(err);
      }
      checkLink(resolvedPath, target);
    });
  }

  function checkLink(resolvedPath, target) {
    if (dereference) {
      // dereference为true的时候
      resolvedPath = path.resolve(basePath, resolvedPath);
    }
    isWritable(target, function (writable) {
      if (writable) {
        return makeLink(resolvedPath, target);
      }
      fs.readlink(target, function (err, targetDest) {
        if (err) {
          return onError(err);
        }
        if (dereference) {
          targetDest = path.resolve(basePath, targetDest);
        }
        if (targetDest === resolvedPath) {
          return cb();
        }
        return rmFile(target, function () {
          makeLink(resolvedPath, target);
        });
      });
    });
  }

  function makeLink(linkPath, target) {
    fs.symlink(linkPath, target, function (err) {
      if (err) {
        return onError(err);
      }
      return cb();
    });
  }

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

  function onError(err) {
    if (options.stopOnError) {
      // 如果设置为一遇到错误就停止复制，则执行cback回调，并且返回
      return cback(err);
    }
    else if (!errs && options.errs) {
      // 如果options.errs存在，比如process.stdout则创建这个可写流用于写入errs
      errs = fs.createWriteStream(options.errs);
    }
    else if (!errs) {
      // 如果没有可写流，则创建一个数组用于存放错误信息
      errs = [];
    }
    if (typeof errs.write === 'undefined') {
      // 如果errs不是可写流，将错误push到数组
      errs.push(err);
    }
    else { 
      errs.write(err.stack + '\n\n');
    }
    return cb();
  }

  /**
   * 
   * @param {*} skipped
   * 如果 skipped 为true，则
   */
  function cb(skipped) {
    if (!skipped) running--;
    finished++;
    if ((started === finished) && (running === 0)) {
      if (cback !== undefined ) {
        return errs ? cback(errs) : cback(null);
      }
    }
  }
}
