const Discord = require('discord.js');

// replaces default puppeteer
const puppeteer = require('puppeteer-extra')

// stealth plugin for puppeteer
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

// load stealth plugin
puppeteer.use(StealthPlugin())


/** 
 * @param {Discord.Message} msg 
 */
module.exports = (msg) => {
   
    if (msg.content.startsWith('!reverse ')) {

        console.log('ReverseSearch triggered')

        let image_url = msg.content.slice(8);

        // assume user is mentioned
        if (msg.mentions.members.first())
            image_url = msg.mentions.members.first().user.avatarURL();

        console.log('url is: ' + image_url);

        (async () => {

            /* start browser and load  google rev image search page */

            const browser = await puppeteer.launch({
                // executablePath: '',
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sanbox', '--headless']
            });

            const page = await browser.newPage();
            page.setViewport({ width: 1000, height: 2000 });

            let page_url =
                'https://images.google.com/searchbyimage?image_url=' + image_url + '&hl=en-IN'
                // 'https://google.com'

            await page.goto(page_url);

            /* parse results */

            const {best_match, results} = await page.evaluate(() =>  {

                results = []

                /* grab the search results */
                
                // g, is the first result
                g = document.querySelector('.normal-header').nextSibling
            
                // strip all useless info, add to results list, fetch next result
                // and repeat
                while(true) {
            
                    let desc = g.textContent.split('›')
                    desc = desc[desc.length -1] // reduced to last item
                    desc = desc.split(' — ')[1] // reduced to text content
                    title = g.querySelector('span').textContent;
                    
                    results.push({"title": title, "desc": desc});
                    
                    g = g.nextSibling

                    if(g) {
                        if(g.className == "g") continue;
                        else break;
                    } else break;
                }
                
                // retrieve the google's 'possible related search' keywords
                let best_match = document.querySelector('#topstuff')
                    .textContent.split('Possible related search:')[1];
                
                return {best_match, results}
                    
            });

            await browser.close();

            // reply the first result

            let resultno = 0;
            let reply = '';
            
            reply += ('**' + results[resultno]['title'] + '**\n');
            reply += (''  + results[resultno]['desc']  +  '\n\n');
        

            let embed = new Discord.MessageEmbed()
            .setDescription(`results that include matching image: (${resultno+1}/${results.length}) \n\n` + reply)
            .setThumbnail(image_url)
            .setColor('#40ab40');

            let sent_msg = await msg.channel.send(`possible related search: ${best_match}`, embed);


            // react nav emotes to reply, to help user navigate
            sent_msg.react('⏪').then(() => sent_msg.react('⏩'));


            /* create a reaction collector and watch for reactions */

            const collector = sent_msg.createReactionCollector((reaction, user) => {
                return ['⏪', '⏩'].includes(reaction.emoji.name);
            }, { time: 60000 });

            
            collector.on('collect', (reaction, user) => {
                if(user.tag != 'DEAN#5189') {
                    // first remove user reaction, so they can react again
                    // to navigate further
                    sent_msg.reactions.resolve('⏩').users.remove(user);
                    sent_msg.reactions.resolve('⏪').users.remove(user);

                    // modify resultno to show prev or next result
                    if (reaction.emoji.name == '⏪') {
                        if(resultno > 0) resultno--;   
                    }
                    else if(reaction.emoji.name == '⏩') {
                        if(resultno < results.length - 1) resultno++;
                    }

                    // reconstruct reply for current selected result
                    reply = ''
                    reply += ('**' + results[resultno]['title'] + '**\n');
                    reply += (''  + results[resultno]['desc']  +  '\n\n');
                    
                    embed = new Discord.MessageEmbed()
                        .setDescription(`results that include matching image: (${resultno+1}/${results.length}) \n\n` + reply)
                        .setThumbnail(image_url)
                        .setColor('#40ab40');
                    
                    sent_msg.edit(`possible related search: ${best_match}`, embed);


                }
                
            
            });

            // remove all reactions when reaction collector timesout
            collector.on('end', collected => {
                collected.forEach((reaction) => {
                    reaction.remove()
                })
            });



 

        })();



    }
}