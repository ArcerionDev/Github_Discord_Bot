const Discord = require('discord.js')
const bot = new Discord.Client()
const prefix = ""
const token = require('./tokens.json').token
const fs = require('fs')
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
 bot.commands.set(command.name, command);
}


bot.on('ready', () => {
    console.log('Online');
    bot.user.setActivity('g!help', {
        type: 'PLAYING'
    }).catch(console.error);

})
bot.on('message', message => {
    let args = message.content.substring(prefix.length).split(" ")
    switch (args[0]) {
        case 'g!help':
            bot.commands.get('help').execute(message, args, Discord, bot);
            break;
        case 'g!ping':
            bot.commands.get('ping').execute(message, args, Discord, bot);
            break;
        case 'g!user':
            bot.commands.get('user').execute(message, args, Discord, bot);
break;
        case 'g!repo':
            bot.commands.get('repo').execute(message, args, Discord, bot);
            break;
        case 'g!search':
            bot.commands.get('search').execute(message, args, Discord, bot);
            break;
        case 'g!codesearch':
            bot.commands.get('codesearch').execute(message, args, Discord, bot);
            break;

        case 'g!usersearch':
          bot.commands.get('usersearch').execute(message, args, Discord, bot);
          break;
}
})
bot.login(token)


