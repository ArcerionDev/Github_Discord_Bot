const fetch = require('node-fetch')
module.exports = {
    name: 'repo',
    description: 'gets github repos',
    execute(message, args, Discord){
        async function getRepo() {
            let repodata = await (await fetch(`https://api.github.com/repos/${args[1]}`)).json()
            if (!repodata.open_issues) {
                repodata.open_issues = 'There are no open issues.'
            }
            if (!repodata.forks) {
                repodata.forks = 'There are no forks.'
            }
            if (!repodata.stargazers_count) {
                repodata.stargazers_count = 0
            }
            if (!repodata.homepage) {
                repodata.homepage = 'There is no website for this repository.'
            }
            if (!repodata.license.name) {
                repodata.license.name = "This repository doesn't have a license."
            }
            const repoembed = new Discord.MessageEmbed()
                .setColor('#00000')
                .setTitle(`${repodata.name} - Data`)
                .setDescription(`Description: ${repodata.description}`)
                .setThumbnail(repodata.owner.avatar_url)
                .setURL(repodata.svn_url)
                .addField(`:warning: Current issues:`, repodata.open_issues, true)
                .addField(':busts_in_silhouette: Owner/Organization:', repodata.owner.login)
                .addField(':star: Stars:', repodata.stargazers_count)
                .addField(':link: Website:', repodata.homepage)
                .addField(':fork_and_knife: Forks:', repodata.forks)
                .addField(':writing_hand: Primary language:', repodata.language)
                .addField(':eyes: Watchers:', repodata.watchers)
                .addField(':scroll: License:', repodata.license.name)
                .addField('<:magnifying_glass:729412713083830324> ID:', repodata.id)
            message.channel.send(repoembed)

        }
        getRepo()
    }}