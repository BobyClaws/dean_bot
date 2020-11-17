/* core libs */

/* first party libs */
const { evenSpace } = require('./util/util');


/* 3-rd party libs */
const Discord = require('discord.js');
const redis = require('redis');


/* commands */
const Gsearch = require('./commands/gsearch');
const WelcomeUser = require('./commands/welcome_user');
const UserAway = require('./commands/user_away');
const ReverseSearch = require('./commands/reverse_search');
const Plotting = require('./commands/plotting');
const muteMember = require('./commands/mute_member');
const webhookSpeak = require('./commands/webhook_speak');


/* import configs */
const config = require('./config');


/* instances */
const dclient = new Discord.Client();
const rclient = new redis.RedisClient({
    'return_buffers': true
});



/* event handlers */

dclient.on('ready', () => {
    // TODO: convert it into startup function
    console.log('logged in as ${client.user.tag}');
    // webhook speak
    webhookSpeak(dclient,rclient);

});


dclient.on('guildMemberAdd', (member) => {
    // welcome message
    WelcomeUser(dclient, member);
});


dclient.on('message', async msg => {
    // testing features
    // only allowed inside #deans-cave
    // also ignore webhook messages
    if(msg.channel.name == 'deans-cave' && !msg.webhookID) {

    }


    /* non testing production commands */
    // make sure the message isnt from webhook
    if(!msg.webhookID) {
        // afk command
        UserAway(rclient, msg);        
        // reverse image search command
        ReverseSearch(msg);
        // google search command        
        Gsearch(msg);
        // Plotting command
        Plotting(rclient, msg);
        // mute command
        muteMember(rclient, msg);   

    }


});


// login and start the client
dclient.login(config.bot_token);
