module.exports = {
    name: 'ping',
    description: 'pong!',
    execute(message, args, Discord){
        var ping = Math.round(bot.ws.ping) + ' ms'
        const pingresponse = new Discord.MessageEmbed()
            .setColor('#00000')
            .setTitle('Pong! Latency is ' + '`' + ping + '`')
        message.channel.send(pingresponse)
    }
}