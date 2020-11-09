const redis = require('redis');

module.exports.expire = (callback) => {
    const expired = () => {
      const sub = redis.createClient()
      sub.subscribe('__keyevent@0__:expired', () => {
        sub.on('message', (channel, message) => {
          callback(message)
        })
      })
    }
  
    const pub = redis.createClient()
    pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], expired)
}