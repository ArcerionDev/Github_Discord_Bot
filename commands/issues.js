const Discord = require('discord.js')
const fetch = require('node-fetch')
const githubtoken = require('../tokens.json').github_token
module.exports = {
    name: 'issues',
    description: 'gets github issues for a specific repo.',
    execute(message, args, Discord){
        if(!args[1]){
            const errorembed = new Discord.MessageEmbed()
            .setTitle("**Provide a repository.**")
            .setColor("#00000")
            message.channel.send(errorembed)
        }else{
        async function fetchIssueData(){
            let issuedata = await (await fetch(`https://api.github.com/repos/${args[1]}/issues`, {
                "method": "GET",
                "headers": {
                    "Authorization": `token ${githubtoken}`
                }
            })
            ).json()            
            if(issuedata.message){
                 const errorembed2 = new Discord.MessageEmbed()
            .setTitle("**Invalid repository.**")
            .setColor("#00000")
            message.channel.send(errorembed2)
            }else{
            if(issuedata.length === 0){
                const noissuesemb = new Discord.MessageEmbed()
                .setTitle("**There are no issues for this repository.**")
            .setColor("#00000")
            message.channel.send(noissuesemb)
            }else{
                let issuenames = []
            let issuenums = issuedata["length"]
            for (let issuelogs = 0; issuelogs < issuenums; issuelogs++) {
                issuenames.push('Issue name: ' + (issuedata[issuelogs].title) + '. Submitted by: ' + (issuedata[issuelogs].user.login))
            }                
           let finalIssueData = issuenames.join('\n' + '\n')
            const issueEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Here are the current open issues.')
        .setDescription('**'+finalIssueData+'**')
    message.channel.send(issueEmbed)
    }}}
    fetchIssueData()
    }
}}