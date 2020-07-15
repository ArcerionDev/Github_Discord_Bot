const Discord = require('discord.js')
module.exports = {
    name: 'help',
    description: 'help command',
    execute(message, args, Discord){
        const helpembed = new Discord.MessageEmbed()
        .setColor("#00000")
        .setAuthor('Github Bot help')
        .setTitle('This bot allows you to remotely access github.com.')
        .setURL('https://github.com')
        .setThumbnail('https://image.flaticon.com/icons/svg/25/25231.svg')
        .setDescription("Here are the current commands:")
        .addField('g!user', 'Shows info on a Github user. Usage: g!user [user].', false)
        .addField('g!repo', 'Allows you to see info on a Github repository. Usage: g!repo [owner/reponame]', false)
        .addField('g!ping', 'Pong!', false)
        .addField('g!search', 'Searches for repos. Usage: g!search [query]', false)
        .addField('g!usersearch', 'Searches for users. Usage: g!usersearch [query]', false)
        .addField('g!codesearch', 'Searches for code. Usage: g!codesearch [query]', false)
        .addField('g!issues', 'Shows issues in a repository. Usage: g!issues [Owner/repository_name]', false)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag} | This bot is not affiliated with Github in any way.`)
    message.channel.send(helpembed)
    }
}