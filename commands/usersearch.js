const fetch = require('node-fetch')
const githubtoken = require('../tokens.json').github_token
module.exports = {
    name: 'usersearch',
    description: 'searches for Github users.',
    execute(message, args, Discord){
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
                   async function searchusers(){
                        let searchdata = await (await fetch(`https://api.github.com/search/users?q=${args[1]}`, {
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
                    let userurls = []
                    for (i = 0; i < searchdata.items.length; i++) {
userurls.push(`[${i+1}]: ${searchdata.items[i].html_url}`)
                    }
                    userurls.join('\n')
                    const searchembed = new Discord.MessageEmbed()
                    .setTitle(`Here are the top ${userurls.length} results for your search.`)
                    .setColor('#00000')
                    .setDescription(userurls)
                    .setFooter('Chat a number 1-10 to see the respective user.')
                message.channel.send(searchembed)
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1, time: 60000000 }).then(collected => {
                        let arrnum = collected.first().content - 1
                        let correctarr = searchdata.items[arrnum]
                        if (!correctarr) {
                            const codeerrembed = new Discord.MessageEmbed()
                                .setColor('#00000')
                                .setTitle(`**Error. Either you didn't enter a number 1-10, or the number of search results is less then 10.**`)
                            message.channel.send(codeerrembed)
                        } else {
                            (async () => {
                            let userdata = await (await fetch(correctarr.url)).json()
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
                                const usersearchembed = new Discord.MessageEmbed()
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
                                message.channel.send(usersearchembed)
                            })();
                        }})
                    }
                    searchusers()
                }
            }
        }
    }}