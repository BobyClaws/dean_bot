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
    
}