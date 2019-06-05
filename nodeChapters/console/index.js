const fs = require('fs')
 
const output = fs.createWriteStream('./nodeChapters/console/stdout.log');
const errorOutput = fs.createWriteStream('./nodeChapters/console/stderr.log');
// 自定义的简单记录器。
const logger = new console.Console({ stdout: output, stderr: errorOutput });
// 像控制台一样使用它。
const count = 5;
logger.log('count: %d', count);
// 在 stdout.log 中: count 5
logger.error('count: %d', count);
// 在 stderr.log 中: count 5