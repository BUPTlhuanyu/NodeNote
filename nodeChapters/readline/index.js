const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt:"new>"
});

/**
 * 用于监测输入的事件
 * line事件
 */
rl.on('line', (input) => {
    console.log(`input:${input}`)
})

/**
 * 用于结束实例生命周期的事件与方法
 * close事件：rl.close()
 */
rl.on('close', () => {
    console.log('close')
    // rl.prompt()
})


/**
 * 用于input流暂停的事件与方法
 * 'pause' 事件:rl.pause()
 */
rl.on('pause',() => {
    console.log('pasue')
    // rl.prompt()
    rl.question('请输入命令',(answer) => {
            console.log(`输入的数据是${answer}`)
        })
})

/**
 * 用于input流恢复的事件与方法
 * 'resume' 事件:rl.prompt(),rl.question(),rl.resume(),rl.write()
 */
rl.on('resume', () => {
    console.log('Readline 恢复');
  });


/**
 * 'SIGINT' 事件与close事件以及pasue事件的关系：
 * 每当 input 流接收到 <ctrl>-C 输入（通常称为 SIGINT）时，就会触发 'SIGINT' 事件。 
 * 如果当 input 流接收到 SIGINT 时没有注册 'SIGINT' 事件监听器，则会触发 'pause' 事件，然后会触发'close'事件
 */
rl.on('SIGINT', () => {
    // rl.question('确定要退出吗？', (answer) => {
    //   if (answer.match(/^y(es)?$/i)) rl.pause();
    // });
    console.log('SIGINT')
  });






