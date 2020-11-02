const Discord = require('discord.js');

module.exports = (client, member) => {
    console.log('new user joined');
    //et channel = client.channels.cache.get('770156894077059083'); // boby's channel id
    let channel = client.channels.cache.get('744209394358812726'); // general channel id
    const embed = new Discord.MessageEmbed()
        .setTitle('Welcome!')
        .setDescription(`welcome to ${member.guild.name}, <@${member.id}>.\nHope you enjoy your stay!`)
        .setImage('https://cdn.discordapp.com/attachments/744255255738318888/771421191147094056/welcome.gif')
        .setThumbnail(member.guild.iconURL())
        .setColor('#40ab40');
    
    channel.send(embed);    
}

