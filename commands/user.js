const Discord = require('discord.js')
const fetch = require('node-fetch')
module.exports = {
    name: 'user',
    description: 'gets github users',
    execute(message, args, Discord){
        if (!args[1]) {
            const argsemb = new Discord.MessageEmbed()
                .setColor('#00000')
                .setTitle('**Provide a user.**')
            message.channel.send(argsemb)
        } else {
            async function getUser() {
                let userdata = await (await fetch(`https://api.github.com/users/${args[1]}`)).json()
                if (!userdata.login) {
                    const erremb = new Discord.MessageEmbed()
                        .setColor('#00000')
                        .setTitle('**Invalid user.**')
                        .setFooter("Check your spelling?")
                    message.channel.send(erremb)
                } else {
                    let hasEmail;
                    if (!userdata.email) { hasEmail = 'This user does not have a public email.' } else {
                        hasEmail = userdata.email
                    }
                    let hasSite;
                    if (!userdata.blog) { hasSite = 'This user does not have a website.' } else {
                        hasSite = userdata.blog
                    }
                    let hasName;
                    if (!userdata.name) { hasName = userdata.login } else {
                        hasName = userdata.name
                    }
                    let hasLocation;
                    if (!userdata.location) { hasLocation = "This user doesn't have a public location." } else {
                        hasLocation = userdata.location
                    }
                    let hasCompany;
                    if (!userdata.company) { hasCompany = "This user doesn't work for anyone." } else {
                        hasCompany = userdata.company
                    }
                    let hasBio;
                    if (!userdata.bio) { hasBio = "This user doesn't have a description." } else {
                        hasBio = userdata.bio
                    }
                    if (!userdata.public_repos) {
                        userdata.public_repos = 0
                    }
                    if (!userdata.followers) {
                        userdata.followers = 0
                    }
                    if (!userdata.following) {
                        userdata.following = 0
                    }
                    const userembed = new Discord.MessageEmbed()
                        .setThumbnail(userdata.avatar_url)
                        .setColor('#00000')
                        .setTitle(`${userdata.login} - Data`)
                        .setDescription(`Description: ` + hasBio)
                        .setURL(userdata.html_url, true)
                        .addField(':bust_in_silhouette: Name:', hasName, true)
                        .addField(':house: Location: ', hasLocation, true)
                        .addField(':link: Website: ', hasSite, true)
                        .addField(':office: Company:', hasCompany, true)
                        .addField(':envelope: Email: ', hasEmail, true)
                        .addField(':eyes: Followers:', userdata.followers, true)
                        .addField(':busts_in_silhouette: Following:', userdata.following, true)
                        .addField('<:gitlogo:719597168247177336> Repositories:', userdata.public_repos, true)
                        .addField('<:magnifying_glass:729412713083830324> ID: ', userdata.id, true)
                    message.channel.send(userembed)
                }
            }
            getUser()
        }
    }
}