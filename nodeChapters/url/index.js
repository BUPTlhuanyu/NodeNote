/**
 * 兼容不同平台下的路径：url.fileURLToPath(url)、url.pathToFileURL(path)
 */


const { URL, domainToASCII, domainToUnicode, fileURLToPath, format } = require('url');
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
  // 输出 #bar

myURL.hash = 'baz';
console.log(myURL.href);
console.log('myURL',myURL)
  // 输出 https://example.org/foo#baz

console.log(domainToASCII('中文.com'));
console.log(domainToUnicode(domainToASCII('中文.com')));

const myURL1 = new URL('https://a:b@你好你好?abc#foo');

console.log(myURL1.href);
  // 输出 https://a:b@xn--6qqa088eba/?abc#foo

console.log(myURL1.toString());
  // 输出 https://a:b@xn--6qqa088eba/?abc#foo

console.log(format(myURL1, { fragment: false, unicode: true, auth: false }));
  // 输出 'https://你好你好/?abc'