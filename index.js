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
    WelcomeUser(dclient, member);
});


dclient.on('message', async msg => {



    // testing features
    // only allowed inside #deans-cave
    if(msg.channel.name == 'deans-cave' && !msg.webhookID) {
        
        // google search command        
        Gsearch(msg);
        
        // Plotting command
        Plotting(rclient, msg);
        
        // mute command
        muteMember(rclient, msg);
      

       
    }

    if(!msg.webhookID) {

        // afk command
        UserAway(rclient, msg);
        
        // reverse image search command
        ReverseSearch(msg);


    }


    // ghost-speak
    if(msg.content.startsWith("!wh")) {

        args = evenSpace(msg.content).split(' ')
        
        console.log(args);
        
        // msg.channel.createWebhook('ghost-speak', {
        //     avatar: 'https://filebin.net/rv2ygpify0kavmra/willyou.jpg?t=ne3rlqve',
        // })
        //     .then(webhook => console.log(`Created webhook ${webhook}`))
        //     .catch(console.error);
        let webhook = await msg.client.fetchWebhook('775804648752807948');
       
        await webhook.edit({
            channel: args[1],
            avatar: args[2],
            name: args[3]
        })

     

        webhook.send(args.slice(4).join(' '));

    }



});


// login and start the client
dclient.login(config.bot_token);
