const fetch = require('node-fetch')
const githubtoken = require('../tokens.json').github_token
module.exports = {
    name: 'codesearch',
    description: 'searches for code in Github.',
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
                    async function searchcode() {
                        let searchdata = await (await fetch(`https://api.github.com/search/code?q=${args[1]}`, {
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
                        let codeurls = []
                        for (i = 0; i < searchdata.items.length; i++) {
                            codeurls.push(`[${i + 1}]: ` + `https://github.com/${searchdata.items[i].repository.full_name}/blob/master/${searchdata.items[i].path}`)
                        }
                        codeurls.join('\n')

                        const searchembed = new Discord.MessageEmbed()
                            .setTitle(`Here are the top ${codeurls.length} results for your search.`)
                            .setColor('#00000')
                            .setDescription(codeurls)
                            .setFooter('Chat a number 1-10 to see the code respective to the number to its left.')
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
                                        let filepath = await (await fetch(`${correctarr.repository.url}/contents/${correctarr.path}`)).json()
                                        let codetext = await (await fetch(filepath.download_url)).text()
                                        let titleinfo = "Here is the result for your search:"
                                        let codemsg = '```\n' + codetext + '\n```'
                                        if (codetext.length > 1999) {
                                            codemsg = `This block of code is ${codetext.length} characters long. The max message content for Discord is 2000 characters. \n The text file is located at ${filepath.download_url}.`
                                            titleinfo = "An error occured, see below for info."
                                        }

                                        let codesearchembed = new Discord.MessageEmbed()
                                            .setTitle(titleinfo)
                                            .setDescription(codemsg)
                                            .setColor("#00000")
                                        message.channel.send(codesearchembed)
                                    })()



                                }
                            })
                    }
                    searchcode()
                }
            }
        }
    }}