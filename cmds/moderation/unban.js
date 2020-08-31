// Stuff

const errors = require('../../lib/errors')
const { success, failure, token } = require('../../config.json')
const embed = require('../../functions/embed')
const moderate = require('../../lib/moderation');
const { MessageEmbed } = require('discord.js');
const Axios = require('axios').default;
async function getBan(guild) {
    const bans = await Axios({
        method: 'get',
        url: `https://discord.com/api/guilds/${guild.guildID}/bans`,
        headers: { 'Authorization': `Bot ${token}`}
    })
    return bans.data
}
module.exports.run = async (bot, message, args, guild) => {
    
    const bans = await getBan(guild)

    // Check if their a moderator because that's  I M P O R T A N T 
    const error = await errors(message, guild)
    const moderrors = error.moderation
    if (error.CheckFor.enabledMod('moderation', 'moderation') === false) return
    if (moderrors.moderationRoles() === false) return

    if (!args[0]) return message.channel.send(embed('Error', 'Missing user to unban, Respond with one of the following:\n`User-Id, User-Name, User-Name#Discriminator`', guild, failure))
    const user = args[0]
    const reason = (args.length > 1) ? `${args.slice(1).join(' ')}` : 'None'
    const isReason = (args.length > 1) ? ` for ${reason}` : ''
    let member = undefined
    // Searching Time!!
    if (user.includes('#')) {
        const split = user.split('#')
        member = await bans.find(o => o.user.username.toLowerCase() === split[0].toLowerCase() && o.user.discriminator === split[1])
    }
    if (isNaN(user) === false) {
        member = await bans.find(o => o.user.id === user)
    }
    else {
        member = await bans.find(o => o.user.username === user.toLowerCase())
    }

    if (member === undefined) return message.channel.send(embed('Error', 'Could not find the banned user ' + user, guild, failure))
    else {
        message.channel.send(embed("none", `${member.user.username}$${member.user.discriminator}(${member.user.id}) has been unbanned ${isReason}`))
        if (guild.moderation.modlog && guild.moderation.modlog !== 'none') {
            const isReason = (args.length > 1) ? reason : 'None'
            const log = new MessageEmbed()
            .setTitle('Member Unbanned')
            .setColor('#ffcd42')
            .setThumbnail(member.user.avatarURL())
            .setDescription(`**User:** ${member.user.username}$${member.user.discriminator}(${member.user.id})\nModerator: ${message.author}(${message.author.username}#${message.author.discriminator})\n**Reason:** ${reason}`)
            message.guild.channels.cache.get(guild.moderation.modlog)
        }
    }


}

module.exports.help = {
    name: 'unban',
    description: 'Unban a member from your Discord Server',
    syntax: ['!unban <user-id>']
}