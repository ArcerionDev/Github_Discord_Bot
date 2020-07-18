const Discord = require('discord.js')
const fetch = require('node-fetch')
module.exports = {
    name: 'src',
    description: 'data and source code on the bot',
    execute(message, args, Discord){
        (async () => {
            let data = bot.users.fetch('683792601219989601')
            const dependencies = require('./package.json').dependencies
            const devembed = new Discord.MessageEmbed()
            .setTitle('Developers and source code:')
            .setDescription(`All commands were created and coded by ${(await data).username}#${(await data).discriminator}`)
            .setColor('#00000')
            .setThumbnail((await data).avatarURL())
            .addField('Check out my Github:','https://github.com/Avn1114/Github_Discord_Bot')
            .setFooter(`Coded with Discord.js`)
            message.channel.send(devembed)
        })();     
    }}