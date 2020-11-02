/* core libs */

/* 3-rd party libs */
const Discord = require('discord.js');
const redis = require('redis');
const sqlite3 = require('sqlite3');

/* features */
const gsearch = require('./commands/gsearch');
const welcomeUser = require('./commands/welcome_user');
const userAway = require('./commands/user_away');
const reverseSearch = require('./commands/reverse_search');
const plotting = require('./commands/plotting');

/* import configs */
const config = require('./config');

/* instances */
const dclient = new Discord.Client();

const rclient = new redis.RedisClient({
    'return_buffers': true
});



/* event handlers */

dclient.on('ready', () => {
    console.log('logged in as ${client.user.tag}');

});

dclient.on('guildMemberAdd', (member) => {
    console.log('new user joined the server..');
    // welcome message
    welcomeUser(dclient, member);
});


dclient.on('message', async msg => {

    // testing features
    // only allowed inside #deans-cave
    if(msg.channel.name == 'deans-cave') {
        // google search command        
        gsearch(msg);
        // graphing command
        plotting(rclient, msg);
        // reverse image search command
        reverseSearch(msg);
        
       
    }

    // afk command
    userAway(rclient, msg);
    


});


// login and start the client
dclient.login(config.bot_token);