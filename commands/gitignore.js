const Discord = require('discord.js')
const fetch = require('node-fetch')
module.exports = {
    name: 'gitignore',
    description: 'gets github gitignore templates.',
    execute(message, args, Discord) {
        (async () => {

            let gittemplates = await (await fetch('https://api.github.com/gitignore/templates')).json()
            gittemplates = gittemplates.join(', ')
            const gitignoreembed = new Discord.MessageEmbed()
                .setTitle('Here are the current .gitignore templates:')
                .setDescription(gittemplates)
                .setFooter('If you would like to get one of these templates, type your selected template into the chat. If not, type "cancel".')
                .setColor('#00000')
            message.channel.send(gitignoreembed)
            message.channel.awaitMessages(m => m.author.id == message.author.id,
                { max: 1, time: 60000000 }).then(collected => {
                    if (collected.first().content === "cancel") {
                        const doneEmbed = new Discord.MessageEmbed()
                            .setTitle('Process of fetching template terminated.')
                            .setColor('#00000')
                        message.channel.send(doneEmbed)
                    } else {
                        collected.first().content = collected.first().content.substring(0, 1).toUpperCase() + collected.first().content.substring(1);
                        fetch(`https://raw.githubusercontent.com/github/gitignore/master/${collected.first().content}.gitignore`)
                            .then(response => response.text())
                            .then(data => {
                                if (data === "404: Not Found") {
                                    const errembed = new Discord.MessageEmbed()
                                        .setTitle('Invalid .gitignore template.')
                                        .setColor('#00000')
                                    message.channel.send(errembed)
                                } else {
                                    if (data.length > 1999) {
                                        const errembed = new Discord.MessageEmbed()
                                            .setTitle('This template is too long to be displayed. Find it here:')
                                            .setDescription(`https://raw.githubusercontent.com/github/gitignore/master/${collected.first().content}.gitignore`)
                                            .setColor('#00000')
                                    } else {
                                        const templateembed = new Discord.MessageEmbed()
                                            .setTitle(`Here is your selected template: (${collected.first().content}.gitignore)`)
                                            .setDescription('```' + data + '```')
                                            .setColor('#00000')
                                        message.channel.send(templateembed)
                                    }
                                }
                            });
                    }
                })
        })();


    }
}