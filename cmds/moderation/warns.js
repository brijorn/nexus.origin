const guild = require('../../models/guildModel/guild')
const { MessageEmbed } = require('discord.js')
module.exports.run = async (bot, message, args, guild) => {
    async function Paginate(id) {
        if (!guild.moderation.moderations.find(o => o.id === id)) return message.channel.send('This user has no moderations')
        const user = guild.moderation.moderations.find(o => o.id === id)
        if (user.warns.length === 0) return message.channel.send('This user has no warns.')
        const warns = user.warns
        let data = []
        let j = 0
    let u = 0
    let i = 0
    // Create data
    async function getData() {
        for (; u < warns.length;) {
            if (j < 5) {
                data[i + 1] = new MessageEmbed()
                let desc = 'If available, use the arrows to see more warnings.'
                for (;u < warns.length && j < 5; u++) {
                    const warning = warns[u]
                    j++
                    desc += `\n**Case ${warning.case}**\nModerator: ${warning.moderator}\nReason: ${warning.reason}\nDate: ${warning.date}`
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


        const pagination = require('../../lib/forEachPagination')
        return await pagination(bot, message, args, guild, data)
    }
    if (!args[0]) {
        const id = message.author.id
        return await Paginate(id)
    }
    if (args[0]) {
        // Include
        const errors = require('../../lib/errors')
        const error = await errors(message, guild)
        const moderrors = error.moderation

        // Check
        if (moderrors.moderationRoles() === false) return

        // Get
        const memberparse = require('../../functions/memberparse')
        const user = await memberparse(message, args)
        const id = user.id
        return await Paginate(id)
    }
}
module.exports.help = {
    name: 'warns',
    description: 'view your or another user\'s warnings',
    syntax: ['!warns', '!warns <user>']
}