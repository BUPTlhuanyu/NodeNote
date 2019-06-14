const path=require('path');
const fs = require('fs')

// 检测文件的改变
fs.watch('./nodeChapters/fs/a.txt',(e, filename) => {
    console.log(filename)
})
console.log(1)

// ===========================================================================

// 复制文件：方法1
// fs.createWriteStream(path[, options])
// options <string> | <Object>
    // flags <string> 参阅支持的文件系统标志。默认值: 'w'。
    // encoding <string> 默认值: 'utf8'。
    // fd <integer> 默认值: null。
    // mode <integer> 默认值: 0o666。
    // autoClose <boolean> 默认值: true。
    // start <integer>
// 由于flags默认为'w'，因此会触发 w 的open事件
const r = fs.createReadStream('./nodeChapters/fs/a.txt');
const w = fs.createWriteStream('./nodeChapters/fs/b.txt');

w.on('open',function(){
    r.pipe(w);
})

w.once('finish',function(){
    console.log('finish')
    fs.stat('./nodeChapters/fs/b.txt',function(err, stats){
        console.log(stats)
    })
    fs.stat('./nodeChapters/fs/a.txt',function(err, stats){
        console.log(stats)
    })
})

// ===========================================================================

// 异步读取文件内容
fs.readFile('./nodeChapters/fs/a.txt', (err, data) => {
    if (err) throw err;
    console.log(data);
  });

// ===========================================================================

//   同步读取文件内容
let aData = fs.readFileSync('./nodeChapters/fs/a.txt')
// 默认返回buffer类型
console.log("aData",aData)

// ===========================================================================

/**
 * 递归创建目录
 */
// 同步
// function makeSync(dir) {
//     let parts=dir.split(path.sep);
//     for (let i=1;i<=parts.length;i++){
//         let parent=parts.slice(0,i).join(path.sep);
//         console.log(parent)
//         try {
//             fs.accessSync(parent);
//         } catch (error) {
//             fs.mkdirSync(parent);
//         }
//     }
// }
// makeSync(path.resolve('./nodeChapters/fs/t1/t2'))

// 异步
function makeAsync(dir,callback) {
    let parts=dir.split(path.sep);
    let i = 1;
    function next(){
        if (i>parts.length)
            return callback&&callback();    
        let parent=parts.slice(0,i++).join(path.sep);
        fs.access(parent,(err)=>{
            if(err){
                fs.mkdir(parent, next)
            }else{
                next()
            }
        })
    }
    next()
}
makeAsync(path.resolve('./nodeChapters/fs/t1/t2'))