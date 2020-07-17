const Discord = require('discord.js')
const fetch = require('node-fetch')
const githubtoken = require('../tokens.json').github_token
module.exports = {
    name: 'licenses',
    description: 'gets github license templates.',
    execute(message, args, Discord){
        (async () => {
            let licensedata = await (await fetch("https://api.github.com/licenses", {
                "method": "GET",
                "headers": {
                    "Authorization": `token ${githubtoken}`
                }
            })
            ).json()
            let licensearr = []
            for (let i = 0; i < licensedata.length; i++) {
                licensearr.push(`[${licensedata[i].spdx_id}](https://raw.githubusercontent.com/github/choosealicense.com/gh-pages/_licenses/${licensedata[i].key}.txt)`)
            }
            licensearr = licensearr.join('\n')
            const licenseembed = new Discord.MessageEmbed()
            .setTitle('Here are the current license templates:')
            .setColor('#00000')
            .setDescription(licensearr)
            message.channel.send(licenseembed)
        })();
    }}
