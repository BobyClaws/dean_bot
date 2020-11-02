const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())


module.exports = (msg) => {
    if(msg.content.startsWith('!reverse ')) {

        let image_url = msg.content.slice(8);

        // assume user is mentioned
        if(msg.mentions.members.first())
            image_url = msg.mentions.members.first().user.avatarURL()


        (async () => {
            
            const browser = await puppeteer.launch({
                // executablePath: '',
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sanbox', '--headless']
            });
            
            const page = await browser.newPage();
        // page.setViewport({width: 1920,height: 1080});
            
            let page_url = 
            'https://images.google.com/searchbyimage?image_url=' + image_url + '&hl=en-IN'
            // 'https://google.com'
        
            await page.goto(page_url);
            await page.screenshot({
                path: 'data/reverse_search/output.png'
                // clip: {x:160,y:130, width:800, height: 500}
            });
        
            await browser.close();

            
            msg.channel.send('here', {files: ['data/reverse_search/output.png']});


        })();
        

    
    }
}