const dclient = require('discord.js')

/***
 * @param {dclient.Message} msg
 */
module.exports = (msg) => {

    if(msg.member.hasPermission('ADMINISTRATOR')) {

        
        let muted = msg.guild.roles.cache.find(r => r.name === 'Muted');
        if(msg.content.startsWith("!m ")) {
            if(msg.mentions.members.first()) {
                let target_member = msg.mentions.members.first();

                target_member.roles.add(muted)
                
            }
        }
    
        if(msg.content.startsWith("!um ")) {
            if(msg.mentions.members.first()) {
                let target_member = msg.mentions.members.first();
                target_member.roles.remove(muted);
            }
        }

    }

}