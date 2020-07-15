const Discord = require('discord.js')
const fetch = require('node-fetch')
const githubtoken = require('../tokens.json').github_token
module.exports = {
    name: 'search',
    description: 'searches for github repos',
    execute(message, args, Discord){
        try {
            if (!args[1]) {
                const argsembed = new Discord.MessageEmbed()
                    .setColor('#00000')
                    .setTitle('**Provide a query.**')
                message.channel.send(argsembed)
            } else {
                if (args.length > 2) {
                    const queryembed = new Discord.MessageEmbed()
                        .setColor('#00000')
                        .setTitle(`**Keep your query to one word.**`)
                    message.channel.send(queryembed)
                } else {
                    if (args[1].length > 249) {
                        const toolongemb = new Discord.MessageEmbed()
                            .setColor('#00000')
                            .setTitle(`**Github doesn't support search queries over 250 characters. Try making a shorter query.**`)
                        message.channel.send(toolongemb)
                    } else {
                        async function searchrepos() {
                            let searchdata = await (await fetch(`https://api.github.com/search/repositories?q=${args[1]}`, {
                                "method": "GET",
                                "headers": {
                                    "Authorization": `token ${githubtoken}`
                                }
                            })
                            ).json()
                            let popnum = searchdata.items.length - 10
                            if (searchdata.items.length > 10) {
                                for (i = 0; i < popnum; i++) {
                                    searchdata.items.pop()
                                }

                            }
                            let repourls = []
                            for (i = 0; i < searchdata.items.length; i++) {
                                repourls.push(`[${i + 1}]: ` + searchdata.items[i].svn_url)
                            }
                            repourls.join('\n')
                            const searchembed = new Discord.MessageEmbed()
                                .setTitle(`Here are the top ${repourls.length} results for your search.`)
                                .setColor('#00000')
                                .setDescription(repourls)
                                .setFooter('Chat a number 1-10 to see the info on the respective repository.')
                            message.channel.send(searchembed)

                            message.channel.awaitMessages(m => m.author.id == message.author.id,
                                { max: 1, time: 60000000 }).then(collected => {
                                    let arrnum = collected.first().content - 1
                                    let correctarr = searchdata.items[arrnum]
                                    if (!correctarr) {
                                        const errembed = new Discord.MessageEmbed()
                                            .setColor('#00000')
                                            .setTitle(`**Error. Either you didn't enter a number 1-10, or the number of search results is less then 10.**`)
                                        message.channel.send(errembed)
                                    } else {
                                        if (!correctarr.open_issues) {
                                            correctarr.open_issues = 'There are no open issues.'
                                        }
                                        if (!correctarr.forks) {
                                            correctarr.forks = 'There are no forks.'
                                        }
                                        if (!correctarr.stargazers_count) {
                                            correctarr.stargazers_count = 0
                                        }
                                        if (!correctarr.homepage) {
                                            correctarr.homepage = 'There is no website for this repository.'
                                        }
                                        let hasLicense;
                                        if (!correctarr.license) {
                                            hasLicense = "This repository doesn't have a license."
                                        } else {
                                            hasLicense = correctarr.license.name
                                        }
                                        const resultembed = new Discord.MessageEmbed()
                                            .setTitle(`${correctarr.name} - General Info.`)
                                            .setColor('#00000')
                                            .setThumbnail(correctarr.owner.avatar_url)
                                            .setDescription(`Description: ${correctarr.description}`)
                                            .setThumbnail(correctarr.owner.avatar_url)
                                            .setURL(correctarr.svn_url)
                                            .addField(`:warning: Current issues:`, correctarr.open_issues, true)
                                            .addField(':busts_in_silhouette: Owner/Organization:', correctarr.owner.login)
                                            .addField(':star: Stars:', correctarr.stargazers_count)
                                            .addField(':link: Website:', correctarr.homepage)
                                            .addField(':fork_and_knife: Forks:', correctarr.forks)
                                            .addField(':writing_hand: Primary language:', correctarr.language)
                                            .addField(':eyes: Watchers:', correctarr.watchers)
                                            .addField(':scroll: License:', hasLicense)
                                            .addField('<:magnifying_glass:729412713083830324> ID:', correctarr.id)
                                        message.channel.send(resultembed)
                                    }
                                })
                        }
                        searchrepos()
                    }
                }
            }
        } catch{
            const erroremb = new Discord.MessageEmbed()
                .setColor('#00000')
                .setTitle('**An error occured, please try again later.**')
            message.channel.send(erroremb)
        }  
    }}