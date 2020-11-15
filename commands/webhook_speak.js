const {expire}  = require('../util/redis')

module.exports = (dclient,rclient) => {
       // speak
       expire( async(key) => {
    	
    	if (key == 'speak-dummy') {
    		rclient.get('speak', async (e,r) => {
    			let data = JSON.parse(String(r))    			
                console.log(String(r));
                
	    		let webhook = await dclient.fetchWebhook('775804648752807948');
		        await webhook.edit({
		            channel: data.channel,
		            avatar: data.pfp,
		            name: data.name
		        })
		
			    
		        webhook.send(data.message); 		
	    			
    		})
	
	  
    	}
    })


        // // ghost-speak
        // if(msg.content.startsWith("!wh")) {

        //     args = evenSpace(msg.content).split(' ')
            
        //     console.log(args);
            
        //     msg.channel.createWebhook('ghost-speak', {
        //         avatar: 'https://filebin.net/rv2ygpify0kavmra/willyou.jpg?t=ne3rlqve',
        //     })
        //         .then(webhook => console.log(`Created webhook ${webhook}`))
        //         .catch(console.error);
        //     let webhook = await msg.client.fetchWebhook('775804648752807948');
           
        //     await webhook.edit({
        //         channel: args[1],
        //         avatar: args[2],
        //         name: args[3]
        //     })
    
         
    
        //     webhook.send(args.slice(4).join(' '));
    
        // }
    
}