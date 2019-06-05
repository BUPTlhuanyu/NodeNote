## 按照[构建第一个CLI](https://juejin.im/post/5cf2111b5188250d2850f884)构建的CLI

#### 构建项目
    npm init

#### 创建package.json，并添加属性`bin`
    "bin": {
        "firstcli": "bin/create-project",
        "create-project": "bin/create-project"
    }
当输入命令`create-project`的时候，会执行`bin/create-project`文件，最重要的是需要在`create-project`文件开头加上`#!/usr/bin/env node`，否则这个文件不会被node解释器执行。


#### 注册CLI
    npm link
这个命令将会全局地安装你当前项目的链接，所以当你更新代码的时候，也并不需要重新运行 npm link 命令。在运行 npm link 命令后，你的 CLI 命令应该已经可用了。
    create-project

#### 执行`create-project`命令，会执行`bin/create-project`
`bin/create-project`会调用cli.js开始执行cli

#### cli.js会对输入的参数进行解析，并输出提示，最后开始创建项目
- 参数解析与提示：
    - arg           解析 CLI 参数
    - inquirer      来提示输入参数
- 创建项目：
    - ncp           跨平台的递归拷贝文件
    - chalk         展示彩色输出
    - execa         用于让我们能在代码中很便捷的运行像 git 这样的外部命令
    - pkg-install   用于基于用户使用什么而触发命令 yarn install 或 npm install
    - listr         让我们能指定任务列表，并给用户一个整齐的进程概览

#### main.js用于创建项目


## 一个小问题

利用url.fileURLToPath(URL)解决windows与mac系统下path路径问题：

    const templateDir = path.resolve(
        new URL(import.meta.url).pathname,
        '../../templates',
        options.template
    );

上述代码会出现的问题：`import.meta.url`返回的url为url编码后的url，中文会被`encodeURI`编码，因此在windows系统下无法找到文件。可以用`decodeURI`来将中文进行解码，但是还是有问题，`new URL`返回的url以'/'开头，而`url.fileURLToPath(URL)`能保证百分号编码字符解码结果的正确性，同时也确保绝对路径字符串在不同平台下的有效性。

    const url = require('url');
    new URL('file:///你好.txt').pathname;    // 错误: /%E4%BD%A0%E5%A5%BD.txt
    url.fileURLToPath('file:///你好.txt');       // 正确: /你好.txt (POSIX)

因此正确的代码应该是:

    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
        url.fileURLToPath(currentFileUrl),
        '../../templates',
        options.template.toLowerCase()
    );