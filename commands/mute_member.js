const Discord = require('discord.js');
const { RedisClient } = require('redis');
const { evenSpace } = require('../util/util');
const { expire } = require('../util/redis')

/***
* @param {RedisClient} rclient
* @param {Discord.Message} msg
*/
module.exports = (rclient, msg) => {

    // TODO: check roles instead of admin
    if(msg.member.hasPermission('ADMINISTRATOR') || msg.member.user.tag == 'Boby#0001') {
        let muted = msg.guild.roles.cache.find(r => r.name === 'Muted');
        
        // mute trigger
        if(msg.content.startsWith("!m ")) {
            // parse arguments
            args = evenSpace(msg.content).split(' ');

            if(args.length > 3 || args.length < 2)
                msg.channel.send('invalid command structure, try again.')
            
                // make sure a user to mute is mentioned
            else if(msg.mentions.members.first()) {
                target_member = msg.mentions.members.first();
                
                rclient.set(
                    `state>muted>${target_member.id}`,
                    '1'
                )
                console.log(`state>muted>${target_member.id}`);
                


                // if time to mute is given, make the redis key expire accordingly
                if(args.length == 3) {

                    duration = args[2].slice(0,-1)
                    let modifiers = {
                        's': 1,
                        'm': 60,
                        'h': 60*60,
                        'd': 60*60*24,
                        'w': 60*60*24*7,
                        "M": 60*60*24*30,
                        "y": 60*60*24*365
                    }

                    let modifier = args[2].slice(-1);
                    duration = duration * modifiers[modifier];
               
               
                    // callback when key expires
                    expire((key) => {
                        console.log('key expired: ' + key);
                        let member_id = key.split('state>muted>')[1]
                        let member = msg.guild.members.cache.get(member_id);
                        unmute(rclient, member, muted);
                    })

                    rclient.expire(
                        `state>muted>${target_member.id}`,
                        duration
                    )
                }
                target_member.roles.add(muted)
                msg.channel.send('muted succesfully')


            }


            
        }

        // unmute trigger
        if(msg.content.startsWith("!um ")) {
            if(msg.mentions.members.first()) {
                let target_member = msg.mentions.members.first();
                unmute(rclient, target_member, muted);
                msg.channel.send('unmuted succesfully')
            
            }
        }



    }


}

function unmute(rclient, target_member, muted_role) {
    rclient.del(`state>muted>${target_member.id}`)
    target_member.roles.remove(muted_role);
    console.log('unmuted: ' + target_member.id + ', ' + target_member.user.tag)
}
