// 管道流加密解密
const crypto = require('crypto');
const fs = require('fs')
const cipher = crypto.createCipher('aes192', 'a password');

const input = fs.createReadStream('test.js')
const output = fs.createWriteStream('test.txt')

input.pipe(cipher).pipe(output)

// const decipher = crypto.createDecipher('aes192', 'a password');

// const inputR = fs.createReadStream('test.txt');
// const outputW = fs.createWriteStream('retest.js');

// // inputR.pipe(decipher).pipe(outputW);