const util = require('util');
const fs = require('fs');

const t = function(){}

const stat = util.promisify(t);

console.log(stat.toString())

// util.promisify的作用如下，会在t执行的时候，传入一个错误处理函数作为t的最后一个参数
// function fn(...args) {
//     return new Promise((resolve, reject) => {
//       original.call(this, ...args, (err, ...values) => {
//         if (err) {
//           return reject(err);
//         }
//         if (argumentNames !== undefined && values.length > 1) {
//           const obj = {};
//           for (var i = 0; i < argumentNames.length; i++)
//             obj[argumentNames[i]] = values[i];
//           resolve(obj);
//         } else {
//           resolve(values[0]);
//         }
//       });
//     });
//   }

// fs.link("F:\\web学习路线\\项目\\NodeNote\\utils\\ncp\\test.txt","F:\\web学习路线\\项目\\NodeNote\\utils\\ncp\\1.lnk",(err)=>{
//     if (err) {
//         return console.log(err);
//       }
// })

// fs.symlink("F:\\web学习路线\\项目\\NodeNote\\utils\\ncp\\test.txt", "F:\\web学习路线\\项目\\NodeNote\\utils\\ncp\\1.lnk",(err)=>{
//     if (err) {
//         return console.log(err);
//         }
//     }
// );

fs.readlink("F:\\web学习路线\\项目\\NodeNote\\utils\\ncp\\1.lnk", function (err, resolvedPath) {
    if (err) {
      return console.log(err);
    }
    console.log(resolvedPath);
  });