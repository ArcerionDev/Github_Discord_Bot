const Discord = require('discord.js')
const bot = new Discord.Client()
const fetch = require('node-fetch')
const prefix = "";
const token = require('./token.json').token
bot.on('ready', () => {
    console.log('Online');
    bot.user.setActivity('g!help', {
        type: 'PLAYING'
    }).catch(console.error);

})
bot.on('message', message => {
    let args = message.content.substring(prefix.length).split(" ")
    switch (args[0]){

    }
})
bot.login(token)


