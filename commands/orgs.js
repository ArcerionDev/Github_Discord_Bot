const Discord = require('discord.js')
const fetch = require('node-fetch')
const githubtoken = require('../tokens.json').github_token
module.exports = {
    name: 'orgs',
    description: 'gets github organizations.',
    execute(message, args, Discord){
        if (!args[1]) {
            const errorembed = new Discord.MessageEmbed()
                .setTitle("**Provide a organization.**")
                .setColor("#00000")
            message.channel.send(errorembed)
        } else {
            async function getorg() {
                let orgdata = await (await fetch(`https://api.github.com/orgs/${args[1]}`, {
                    "method": "GET",
                    "headers": {
                        "Authorization": `token ${githubtoken}`
                    }
                })
                ).json()
                if (!orgdata.name) {
                    const erremb = new Discord.MessageEmbed()
                        .setColor('#00000')
                        .setTitle('**Invalid organization.**')
                    message.channel.send(erremb)
                } else {
                    let orgmembers = await (await fetch(`https://api.github.com/orgs/${args[1]}/public_members`, {
                        "method": "GET",
                        "headers": {
                            "Authorization": `token ${githubtoken}`
                        }
                    })
                    ).json()
                    let contributors = []
                    for (let i = 0; i < orgmembers.length; i++) {
                        contributors.push(orgmembers[i].login)
        
                    }
                    contributors = contributors.join(', ')
                    if (!orgdata.blog) {
                        orgdata.blog = "This organization doesn't have a website."
                    }
                    if (!orgdata.company) {
                        orgdata.company = "This organization isn't under anyone."
                    }
                    if (!orgdata.location) {
                        orgdata.location = "This organization doesn't have a public location."
                    }
                    if (!orgdata.twitter_username) {
                        orgdata.twitter_username = "This organization doesn't have a Twitter account."
                    }
                    if (!orgdata.description) {
                        orgdata.description = "This organization doesn't have a description."
                    }
                    if (!orgdata.public_repos) {
                        orgdata.public_repos = 0
                    }
                    if (!contributors) {
                        contributors = "There are no public members."
                    }
                    const orgemb = new Discord.MessageEmbed()
                        .setTitle(`${orgdata.name} - General Data`)
                        .setURL(orgdata.html_url)
                        .setThumbnail(orgdata.avatar_url)
                        .setDescription(`Description: ${orgdata.description}`)
                        .addField(':link: Website:', orgdata.blog)
                        .addField(':office: Company:', orgdata.company)
                        .addField(':house: Location:', orgdata.location)
                        .addField('<:gitlogo:719597168247177336> Repositories:', orgdata.public_repos)
                        .addField('<:Twitter:733713078604136498> Twitter:', orgdata.twitter_username)
                        .setFooter("People: " + contributors)
                    message.channel.send(orgemb)
        
        
        
                }
            }
            getorg()
        
        }
    }}
