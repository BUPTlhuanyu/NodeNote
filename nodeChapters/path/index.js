/**
 * path模块用于处理路径
 */
const path = require('path')

console.log(path.basename('/foo/bar/baz/asdf/quux.html'));
console.log(path.basename('/foo/bar/baz/asdf/quux.html', '.html'));

console.log(path.dirname('/foo/bar/baz/asdf/quux'));

console.log(path.isAbsolute('./a'));

console.log(path.join('a','b'));


const templateDir = path.resolve(
    "/F:/web学习路线/项目/NodeNote/demo/firstCli/src/main.js",
    '../../templates'
);
console.log(templateDir)
