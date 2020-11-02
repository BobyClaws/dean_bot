module.exports = (rclient, msg) => {

// trigger afk command
if(msg.content.startsWith('afk on')) {

/* command code */

    reason = msg.content.slice(7).trim();
    rclient.hmset(
        'afk',
        msg.member.id,
        `{"name":"${msg.member.user.username}","reason":"${reason}"}`
    );


} else {


    // if message is from user whose AFK is set 
    // remove his AFK 
    if(msg.member)
    rclient.hexists('afk', msg.member.id, (err, val) => {    
        if(val)
            rclient.hdel('afk', msg.member.id)
         else {


            try { // assume AFKed is mentioned

                /* get AFKed user status and respond */
                let id = msg.mentions.members.first().id;
                rclient.hmget('afk', id, (err,val) => {

                    // val is a list, so grab first member 
                    // there is always only one member in response
                    // since id (key) is unique
                    val = val[0]

                    if(val != null) {
                        let status = JSON.parse(String(val));
                        console.log(status);

                        if(status.reason == '')
                            msg.channel.send(`${status.name} is AFK.`);
                        else
                            msg.channel.send(`${status.name} is AFK: ${status.reason}`);
                    }

                });
                
                
            } catch(e) {} // no users mentioned



        }
    })


}

}