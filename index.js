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
case 'g!help':
    const helpembed = new Discord.MessageEmbed()
    .setColor("#00000")
    .setAuthor('Github Bot help')
    .setTitle('This bot allows you to remotely access Github.com.')
    .setURL('https://github.com')
    .setThumbnail('https://image.flaticon.com/icons/svg/25/25231.svg')
    .setDescription("Here are the current commands:")
    .addField('g!user','Shows info on a Github user. Usage: g!user [user].', false)
    .addField('g!repo', 'Allows you to see info on a Github repository. Usage: g!repo [owner/reponame]',false)
    .addField('g!ping', 'Pong!',false)
    .setTimestamp()
    .setFooter(`Requested by ${message.author.tag} | This bot is not affiliated with Github in any way.`)
    message.channel.send(helpembed)
    break;
    case 'g!ping':
        var ping = Math.round(bot.ws.ping) + ' ms'
        const pingresponse = new Discord.MessageEmbed()
            .setColor('#00000')
            .setTitle('Pong! Latency is ' + '`' + ping + '`')
        message.channel.send(pingresponse)
        break;
    case 'g!user':
    if(!args[1]){
       const argsemb = new Discord.MessageEmbed()
       .setColor('#00000')
       .setTitle('**Provide a user.**')
        message.channel.send(argsemb)
    }else{
    async function getUser(){ let userdata = await (await fetch(`https://api.github.com/users/${args[1]}`)).json()
    if(!userdata.login){
        const erremb = new Discord.MessageEmbed()
        .setColor('#00000')
        .setTitle('**Invalid user.**')
        .setFooter("Check your spelling?")
        message.channel.send(erremb)
    }else{
    let hasEmail;
    if(!userdata.email){hasEmail = 'This user does not have a public email.'}else{
        hasEmail = userdata.email
    }
    let hasSite;
    if(!userdata.blog){hasSite = 'This user does not have a website.'}else{
        hasSite = userdata.blog
    }
    let hasName;
    if(!userdata.name){hasName = userdata.login}else{
        hasName = userdata.name
    }
    let hasLocation;
    if(!userdata.location){hasLocation = "This user doesn't have a public location."}else{
       hasLocation = userdata.location
    }
    let hasCompany;
    if(!userdata.company){hasCompany = "This user doesn't work for anyone."}else{
       hasCompany = userdata.company
    }
    let hasBio;
    if(!userdata.bio){hasBio = "This user doesn't have a description."}else{
        hasBio = userdata.bio
     }
    const userembed = new Discord.MessageEmbed()
.setThumbnail(userdata.avatar_url)
.setColor('#00000')
.setTitle(`${userdata.login} - Data`)
.setDescription(`Description: `+ hasBio)
.setURL(userdata.html_url,true)
.addField(':bust_in_silhouette: Name:',hasName,true)
.addField(':house: Location: ' ,hasLocation,true)
.addField(':link: Website: ' , hasSite,true)
.addField(':office: Company:' ,hasCompany,true)
.addField(':envelope: Email: ' ,hasEmail,true)
.addField(':eyes: Followers:' ,userdata.followers,true)
.addField(':busts_in_silhouette: Following:' ,userdata.following,true)
.addField('<:gitlogo:719597168247177336> Repositories:' ,userdata.public_repos,true)
.addField('<:magnifying_glass:729412713083830324> ID: ' , userdata.id,true)
message.channel.send(userembed)
}}
getUser()
break;
    }
    case 'g!repo':
        async function getRepo(){
            let repodata = await (await fetch(`https://api.github.com/repos/${args[1]}`)).json()
            if(!repodata.open_issues){
                repodata.open_issues = 'There are no open issues.'
            }
            if(!repodata.forks){
                repodata.forks = 'There are no forks.'
            }
            if(!repodata.stargazers_count){
                repodata.stargazers_count = 0
            }
            if(!repodata.homepage){
                repodata.homepage = 'There is no website for this repository.'
            }
            if(!repodata.license.name){
                repodata.license.name = "This repository doesn't have a license."
            }
            const repoembed = new Discord.MessageEmbed()
            .setColor('#00000')
            .setTitle(`${repodata.name} - Data`)
            .setDescription(`Description: ${repodata.description}`)
            .setThumbnail(repodata.owner.avatar_url)
            .setURL(repodata.svn_url)
            .addField(`:warning: Current issues:`,repodata.open_issues,true)
            .addField(':busts_in_silhouette: Owner/Organization:',repodata.owner.login)
            .addField(':star: Stars:',repodata.stargazers_count)
            .addField(':link: Website:',repodata.homepage)
            .addField(':fork_and_knife: Forks:',repodata.forks)
            .addField(':writing_hand: Primary language:',repodata.language)
            .addField(':eyes: Watchers:',repodata.watchers)
            .addField(':scroll: License:',repodata.license.name)
            .addField('<:magnifying_glass:729412713083830324> ID:',repodata.id)
            message.channel.send(repoembed)

        }
        getRepo()
}
})
bot.login(token)


