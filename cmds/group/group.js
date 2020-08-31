const { MessageEmbed } = require('discord.js')
module.exports.run = async (bot, message, args, guild) => {
    if (!args[0]) {
        if (!guild.robloxGroup) return message.channel.send('No setup roblox group.')
        const lookup = require('../../functions/lookupFunction')
        const thumbnail = require('../../functions/thumbnailFunction')
        let group = await lookup(guild.robloxGroup, 'group')
        group = group.groupFetch
        const groupicon = await thumbnail(guild.robloxGroup, 512, 'group')
        const shout = (group.shout === null) ? '' : `\n**Latest Shout:** ${group.shout.body} *from ${group.shout.poster.username}*`
        console.log(group)
        const groupinfo = new MessageEmbed()
        .setTitle(group.name)
        .setURL(`https://www.roblox.com/groups/${guild.robloxGroup}`)
        .setDescription(group.description + `\n${shout}`)
        .addField('Owner', `[${group.owner.username}](https://www.roblox.com/users/${group.owner.userId}/profile)`, true)
        .addField('MemberCount', group.memberCount, true)
        .addField('Public', group.publicEntryAllowed, true)
        .setThumbnail(groupicon)
    
        message.channel.send(groupinfo)
    }
    args = args.map(e => e.toLowerCase())
    if (!args[0]) return
    if (args[0].startsWith('rank')) {
        const fetch = require('node-fetch')
        let ranks = await fetch(`https://groups.roblox.com/v1/groups/${guild.robloxGroup}/roles`).then(res => res.json())
        ranks = ranks.roles
        console.log(ranks)
        let data = ['filler']
        let j = 0
        let u = 0
        let i = 0
        async function getData() {
            for (; u < ranks.length;) {
                if (j < 8) {
                    data[i + 1] = new MessageEmbed()
                    let desc = 'If available, use the arrows to see more ranks.'
                    for (;u < ranks.length && j < 5; u++) {
                        const rank = ranks[u]
                        j++
                        data[i + 1].addField(`${rank.name}`, `**ID:** ${rank.id}\n**Rank:** ${rank.rank}\n**MemberCount:** ${rank.memberCount}\n`, true)
                    }
                    if (j === 5) {
                        j = 0
                    }
                    data[i + 1].setDescription(desc)
                    i++
                }
            }
            return
        }
        await getData()
        const paginate = require('../../lib/forEachPagination')
        return await paginate(bot, message, args, guild, data, false)
    }
}

module.exports.help = {
    name: 'group',
    description: 'Information on the linked Roblox group',
    module: 'group',
    aliases: ['g']

}