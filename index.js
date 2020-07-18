const Discord = require('discord.js')
const bot = new Discord.Client()
const fetch = require('node-fetch')
const prefix = ""
const btoa = require('btoa')
const token = require('./tokens.json').token
const githubtoken = require('./tokens.json').github_token
const credentials = require('./credentials.json').creds
const fs = require('fs')
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
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
        case 'g!issues':
            bot.commands.get('issues').execute(message, args, Discord, bot);
            break;
        case 'g!gitignore':
            bot.commands.get('gitignore').execute(message, args, Discord, bot);
            break;
        case 'g!licenses':
            bot.commands.get('licenses').execute(message, args, Discord, bot);
            break;
        case 'g!orgs':
            bot.commands.get('orgs').execute(message, args, Discord, bot);
            break;
      
    }
})
bot.login(token)


