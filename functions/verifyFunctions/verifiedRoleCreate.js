const Discord = require('discord.js')
const embed = require('../embed')
const guildModel = require('../../models/guildModel/guild')
module.exports = async (bot, message, guild) => {
    let role = ''
        if (message.guild.roles.cache.find(role => role.name === 'Verified' || role.name === 'verified')) {
            const foundval = message.guild.roles.cache.find(role => role.name === 'Verified' || role.name === 'verified')
            role = foundval.id
            guild.verificationSettings.verifiedRole = role
                guild.markModified('verificationSettings')
                await guild.save()
        }
        if (!message.guild.roles.cache.find(role => role.name === 'Verified' || role.name === 'verified')) {
            message.guild.roles.create({
                data: {
                    name: 'Verified'
                },
                reason: 'Nexus Origin Verification Role Setup',
            }).then(async created => {
                role = created.id
                guild.verificationSettings.verifiedRole = role
                guild.markModified('verificationSettings')
                await guild.save()
            })
        }
        return role
}