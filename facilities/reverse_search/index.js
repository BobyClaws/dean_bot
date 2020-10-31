const RedisClient = require('redis');

const rclient = RedisClient.createClient();


console.log('inside')
rclient.get('reverse_search>input', (e,r) => {
    url = String(r)
    console.log(url);
})

process.exit()
