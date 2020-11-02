/* core libs */

/* 3-rd party libs */
const Discord = require('discord.js');
const redis = require('redis');
const sqlite3 = require('sqlite3');

/* features */
const Gsearch = require('./commands/gsearch');
const WelcomeUser = require('./commands/welcome_user');
const UserAway = require('./commands/user_away');
const ReverseSearch = require('./commands/reverse_search');
const Plotting = require('./commands/plotting');

/* import configs */
const config = require('./config');
const muteMember = require('./commands/mute_member');

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
    WelcomeUser(dclient, member);
});


dclient.on('message', async msg => {

    // testing features
    // only allowed inside #deans-cave
    if(msg.channel.name == 'deans-cave') {
        // google search command        
        Gsearch(msg);
        // graphing command
        Plotting(rclient, msg);
        // reverse image search command
        ReverseSearch(rclient, msg);
        // mute command
        muteMember(msg);
        reverseSearch(msg);
        
       
    }

    // afk command
    UserAway(rclient, msg);
    


});


// login and start the client
dclient.login(config.bot_token);