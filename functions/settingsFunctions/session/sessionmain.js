const { MessageEmbed } = require('discord.js')
const config = require('../../../config.json')
const guildModel = require('../../../models/guildModel/guild')
const embed = require('../../embed')
module.exports = async (bot, message, guild, args) => {
    const help = new MessageEmbed()
    .setTitle('Sessions')
    .setColor(guild.embedInfo.color)
    if (!args[1]) {
        if (!guild.sessions || guild.sessions.sessions === undefined ||!guild.sessions.sessions.length > 0) {
            help.setDescription(`You do not have any sessions set up. You can create one with the \`${guild.prefix}sessions create\` command.`)
        }
        else {
            const sessions = guild.sessions.sessions
            const Status = (guild.sessions.enabled === false) ? `${config.disabled}Disabled` : `${config.enabled}Enabled`
            help.setDescription('Information about Sessions. Use the emojis to navigate the embed.')
            help.addField('Status', Status, true)
            help.addField('Session Count', sessions.length, true)
        }
        
        message.channel.send(help).then(msg => {
            if (guild.sessions.sessions.length > 0) {
                msg.react('⬅️')
                msg.react('➡️')
            }
        })
    }
    if (args[1] === 'create') {
        const sessionCreate = require('./sessionCreate')
        await sessionCreate(bot, message, guild)
    }
    if (args[1] === 'enable') {
        if (!guild.sessions) {
            guild.sessions = {
            enabled: false,
            sessions: [],
        }
        await guild.save()
        }
        guild.markModified('sessions')
        guild.sessions.enabled = true
        await guild.save()
        message.channel.send(embed('none', `${config.enabled} Sessions have successfully been enabled.`, guild))
    }
    if (args[1] === 'disable') {
        if (!guild.sessions) {
            guild.sessions = {
            enabled: false,
            sessions: [],
        }
        await guild.save()
        }
        guild.markModified('sessions')
        guild.sessions.enabled = false
        await guild.save()
        message.channel.send(embed('none', `${config.disabled} Sessions have successfully been disabled.`, guild))
    }
}