const Discord = require("discord.js")
const embed = require('../embed')
const fetch = require('node-fetch')
const editprompt = require('../../prompt/editprompt')
const GuildModel = require('../../models/guildModel/guild')
const rbx = require("noblox.js")
module.exports = async (bot, message, guild, msgToEdit, ID, type) => {
    const Types = ['asset', 'gamepass']
    if (!Types.includes(type)) return message.channel.send(embed('none', 'Error: Please give a valid type.'))
    
    if (type === 'asset') {
        const info = await rbx.getProductInfo(ID)
        .catch(() => {
            message.channel.send(embed('none', 'There was an error fetching the given assetId.', config.failure))
        })
        const rankask = embed('Binding', 'What rank in the verified group is being given?\nExample: `255`', guild)
        const rank = await editprompt(message, msgToEdit, rankask)
        const numbers = new RegExp('^[0-9]+$');
        if (numbers.test(rank) === false) return message.channel.send(embed('none', 'Please give a valid rank ID.'))
        const groupid = await guild.robloxGroup
        const lookup = await fetch(`https://groups.roblox.com/v1/groups/${groupid}/roles`).then(response => response.json())
        .then(body => {
            const info = body.roles
            return info
        })
        const map = lookup.map(roles => roles.rank)
        const rankint = parseInt(rank)
        if (!map.includes(rankint)) return message.channel.send(embed('none', 'Could not find rank.'))
        const therank = lookup.find(element => element.rank === rankint)
        const finished = embed('Binding Successful', `Users will now be able to get the rank **${therank.name}** with ${info.Name}`, guild)
        const finishedsend = msgToEdit.edit(finished)

        await GuildModel.findOne({ guildID: message.guild.id }, async function(err, info) {
            if (!info) {return message.channel.send('erpr')}
            else {
                const rankObj = {
                    name: therank.name,
                    assetID: ID,
                    rank: rank,
                }
                info.rankBinds.push(rankObj)
                await info.save()
            }
        })
    }
}