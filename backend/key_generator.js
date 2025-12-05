const webpush = require('web-push');

const key = webpush.generateVAPIDKeys()

console.log(JSON.stringify(key))