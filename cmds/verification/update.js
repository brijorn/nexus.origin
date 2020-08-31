const embed = require("../../functions/embed")
const config = require('../../config.json')
const verification = require("../../models/verificationModel/verification")
const substring = require("../../functions/substring")
const roleCheck = require('../../functions/verifyFunctions/roleAddCheck')
const nicknaming = require('../../functions/verifyFunctions/nicknaming')
const rbx = require('noblox.js')
const Discord = require('discord.js')
const thumbnail = require('../../functions/thumbnailFunction')
module.exports.run = async (bot, message, args, guild) => {
    function userFind(user) {
        let res = undefined
        if (!message.guild.members.cache.find(one => one.nickname === user)) {
            try {
                res = message.guild.members.cache.find(two => two.user.username === user)
            }
            catch {
                return message.channel.send(embed('User Error', `I couldn't find user ${args[0]}.\nIf you are using the nickname, make sure to have proper capitalization.`, guild, config.failure))
            }
        }
        else {
            res = message.guild.members.cache.find(one => one.nickname === user)
        }
        return res
    }
    let nick = ''
    let mentioned = undefined
    if (!message.member.hasPermission('MANAGE_MESSAGES', { checkAdmin: true, checkOwner: true })  && !guild.permissions.owners.includes(message.author.id) && !guild.permissions.admins.includes(message.author.id)) {
        return message.channel.send(embed('Permissions Error', 'You do not have the required permissions for this command.\nRequired Permission: \`MANAGE_MESSAGES` or `ADMIN` OR `OWNER`', guild, config.failure))
    }
    const arg = (args.length > 0) ? args.slice(0).join(' ') : args[0]
    if (!message.mentions.users.first()) {
        mentioned = await userFind(arg)
    }
    else {
        mentioned = message.mentions.users.first().id
        if (!message.guild.members.cache.get(mentioned)) return message.channel.send(embed('User Not Found', 'Could not find the given user.', guild, config.failure))
    }
    const member = (message.mentions.users.first()) ? await message.guild.members.cache.get(mentioned) : mentioned
    const ID = (message.mentions.users.first()) ? mentioned : mentioned.id
    if (!await verification.findOne({ userID: ID})) return message.channel.send(embed('User not Verified', 'The user is not verified with the bot.', guild, config.failure))
    await message.react('740748381223256075')
    const user = await verification.findOne({userID: ID})
    const roleAdd = await roleCheck(bot, message, guild, 'upd', member)
            const newUsername = await rbx.getUsernameFromId(user.primaryAccount)
            if (guild.verificationSettings.nicknaming === true) {
                nick = await nicknaming(member, guild, newUsername, roleAdd.roleInfo, 'upd')
            }
            const Verified = new Discord.MessageEmbed()
            .setDescription(`Member successfully updated as ${newUsername}\n\`Nickname: ${nick}\nCurrent Rank: ${roleAdd.roleInfo.roleName}\``)
            .setTitle(`${member.user.username}#${member.user.discriminator} Updated`)
            .setColor(config.success)
            if (roleAdd !== undefined) {
                if (roleAdd.rolesAdded.length !== 0) {
                    const eachrole = roleAdd.rolesAdded.map(each => `${each}`)
                    Verified.addField('Roles Added', eachrole, true)
                }
                if (roleAdd.rolesRemoved.length !== 0) {
                    const eachrole = roleAdd.rolesRemoved.map(each => `${each}`)
                    Verified.addField('Roles Removed', eachrole, true)
                }
            }
            const avatar = await thumbnail(user.primaryAccount, '420', 'user')
            Verified.setAuthor(newUsername, avatar, `https://www.roblox.com/users/${user.primaryAccount}/profile`)
            message.reactions.cache.map(each => each.remove())
            message.react('740751221782085655')
            message.channel.send(Verified)

}

module.exports.help = {
    name: 'update',
    module: 'verification',
    description: 'Updates the roles/nickname of the given user',
    cooldown: 15
}