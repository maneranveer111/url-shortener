
const { isValidUrl, isValidCustomCode, normalizeUrl } = require('./src/utils/urlValidator')
console.log('--- Testing isValidUrl ---')
// Your actual google URL
console.log(isValidUrl('https://www.google.com/search?q=which+language&rlz=1C1RYFA&oq=test&sourceid=chrome'))
// Expected: true 

console.log(isValidUrl('not-a-url'))
// Expected: false

console.log(isValidUrl('ftp://something.com'))
// Expected: false 

console.log(isValidUrl('https://youtube.com'))
// Expected: true 

console.log('\n--- Testing isValidCustomCode ---')
console.log(isValidCustomCode('myBlog'))     // true 
console.log(isValidCustomCode('my-blog'))    // false 
console.log(isValidCustomCode('ab'))         // false  too short
console.log(isValidCustomCode('my blog'))    // false  has space

console.log('\n--- Testing normalizeUrl ---')
console.log(normalizeUrl('https://google.com/'))   // https://google.com
console.log(normalizeUrl('https://google.com'))    // https://google.com
console.log(normalizeUrl('  https://google.com ')) // https://google.com