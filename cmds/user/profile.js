const User = require('../../models/userModel/user')
const userCreate = require('../../models/userModel/userCreate')
const thumbnailFunction = require('../../functions/lookupFunction')
const config = require('../../config.json')
const { MessageEmbed } = require('discord.js')
const verification = require('../../models/verificationModel/verification')
const embed = require('../../functions/embed')
const badgeformater = require('../../functions/profileFunc/badges')
const lookup = require('../../functions/lookupFunction')
module.exports.run = async (bot, message, args, guild) => {
    args = args.map(each => each.toLowerCase())
    message.react('740748381223256075')
    // Cancel if the user is not in the verification database.
    if (!await verification.findOne({userID: message.author.id })) return message.channel.send(embed('none', 'You must be verified to use this command.', guild, config.failure))
    const user = await verification.findOne({ userID: message.author.id })
    // Create the user if it can't find one.
    if (await User.exists({ userID: message.author.id}) === false) {
        await userCreate(message)
    }
    const profile = await User.findOne({ userID: message.author.id })

    if (!args[0]) {
        let badges = await badgeformater(profile)
        let description = `${badges}`
        // Get and set the presence if enabled
        const presence = require('../../functions/profileFunc/presence')
        if (profile.presence && profile.presence === true) description = description + `\n**Presence**: ${await presence(user.primaryAccount)}`
        if (profile.status && profile.status !== 'none') description = description + `\n**Status**: ${profile.status}`
        // Create the profile embed.
        const profileinfo = new MessageEmbed()
        .setTitle('Origin Profile')
        .setAuthor(`${message.author.username}`, message.author.avatarURL(), `https://www.roblox.com/users/${user.primaryAccount}/profile`)
        .addField('Roblox Account', user.primaryAccount, true)
        .setColor('#36393E')
        .setFooter(`To configure your profile run ${guild.prefix}profile config.`, guild.embedInfo.footerlogo)
        // Check if they have a profile and they didn't set it to none.
        if (profile.profileDesc && profile.profileDesc.toLowerCase() !== 'none') description = description + `\n${profile.profileDesc}`
        profileinfo.setDescription(description)
        // Check if they have a primary
        if (profile.primaryGroup === true) profileinfo.addField('Primary Group', await lookup(user.primaryAccount, 'primary'), true)
        // Check if they set a thumbnail and if it isn't none
        if (profile.thumbnail && profile.thumbnail !== 'none') profileinfo.setThumbnail(profile.thumbnail)
        // Check if the guild has any points sytems and add it to the user's profile
        if (guild.points && guild.points.enabled === true) {
            await guild.points.systems.forEach(each => {
                if (each.users.find(theauser => theauser.userId === parseInt(user.primaryAccount))) {
                    const userp = each.users.find(daoneuser => daoneuser.userId === parseInt(user.primaryAccount))
                    profileinfo.addField(each.name, `${userp.points} ${each.currency}`, true)
                }
                else {
                    return
                }
            })
        }
        message.reactions.cache.map(each => each.remove())
        const profilesend = await message.channel.send(profileinfo)
        return
    }
    if (args[0] === 'config') {
        message.reactions.cache.map(each => each.remove())
        const profileconfig = require('../../functions/profileFunc/profileconfig')
        return await profileconfig(bot, message, args, guild, profile, user)
    }
    else {
        message.react(config.loadingemoji)
        let mentioned = ''
        const getprofile = require('../../functions/profileFunc/getprofile')
        await getprofile(bot, message, args, guild, mentioned)
    }


}

module.exports.help = {
    name: 'profile',
    module: 'user',
    syntax: ['!profile', '!profile <nickname, username, userId, mention>'],
    description: 'Show your Origin Profile'
}