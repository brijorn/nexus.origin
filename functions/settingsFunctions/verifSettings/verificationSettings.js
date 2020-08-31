const embed = require('../../embed')
const config = require('../../../config.json')
const { MessageEmbed } = require('discord.js')
const verification = require('../../../models/verificationModel/verification')
const editStart = require('../../../prompt/editStartPrompt')
const editprompt = require('../../../prompt/editprompt')
const enabledisable = require('../../../lib/enabledisable')
const role = require('../../../lib/role')
module.exports = async (bot, message, args, guild) => {
    console.log(args)
    if (!args[1]) {
        const verification = guild.verificationSettings
        const unverifiedStatus = (verification.unverifiedEnabled === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`
        const dmVerificationStatus = (verification.dmVerifications === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`
        const nicknameStatus = (verification.nicknaming === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`
        const autoVerifyStatus = (verification.autoVerify === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`
        console.log(verification.unverifiedRole)
        const unverifiedRoleStatus = (verification.unverifiedRole === "" || verification.unverifiedRole === undefined) ? 'None' : `${message.guild.roles.cache.get(verification.unverifiedRole)}` + ' : ' + verification.unverifiedRole

        const info = new MessageEmbed()
        .setTitle('Verification Settings')
        .setDescription(`You can run the command ${guild.prefix}settings verification <setting> to change a setting.`)
        .addField('Group', `[${guild.robloxGroup}](https://www.roblox.com/groups/${guild.robloxGroup})`, true)
        .addField('VerifiedRole', `${message.guild.roles.cache.get(verification.verifiedRole)} : ${verification.verifiedRole}`, true)
        .addField('Bound Roles', guild.roleBindings.length, true)
        .addField('UnverifiedEnabled', unverifiedStatus, true)
        .addField('UnverifiedRole', unverifiedRoleStatus, true)
        .addField('AutoVerify', autoVerifyStatus, true)
        .addField('Nicknaming', nicknameStatus, true)
        .addField('NicknameFormat', verification.nicknameFormat, true)
        .addField('dmVerification', dmVerificationStatus, true)
        const mainpage = await message.channel.send(info)
        mainpage.react('➡️')
        const paging = require('./paging')
        await paging(bot, message, guild, mainpage, info)
        return
    }
    arg1low = args[1].toLowerCase()
    if (arg1low === 'unverified' || arg1low === 'unverifiedenabled') {
        await enabledisable(bot, message, args, guild, 'verificationSettings', 'unverifiedEnabled', 'UnverifiedRoles')
    }
    if (arg1low === 'unverifiedrole') {
        const unverified = require('../../../lib/role')
        await role(bot, message, args, guild, 'unverifiedRole', 'Unverified')
    }
    if (arg1low === 'nicknaming' || arg1low === 'nickname') {
        await enabledisable(bot, message, args, guild, 'verificationSettings', 'nicknaming', 'Nicknaming')
    }
    if (arg1low === 'verified' || arg1low === 'verifiedrole') {
        const role = require('../../../lib/role')
        await role(bot, message, args, guild, 'verifiedRole', 'Verified')
    }
    if (arg1low === 'nicknameformat') {
        const nickformat = require('./nicknameFormat')
        await nickformat(bot, message, args, guild)
    }
    if (arg1low === 'autoverify') {
        await enabledisable(bot, message, args, guild, 'verificationSettings', 'autoVerify', 'Auto Verification')
    }
    if (arg1low.includes('dmverification')) {
        await enabledisable(bot, message, args, guild, 'verificationSettings', 'dmVerifications', 'dmVerifications')
    }
}