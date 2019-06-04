
const fs = require('fs')
fs.watch('./nodeChapters/fs/a.txt',(e, filename) => {
    console.log(filename)
})
console.log(1)