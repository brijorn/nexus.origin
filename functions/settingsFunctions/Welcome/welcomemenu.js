const { MessageEmbed } = require("discord.js")
const config = require('../../../config.json')
module.exports = async (bot, message, args, guild) => {
    // Create the welcome object if none exists
    if (!guild.welcome) {
        const defaultObj = {
            enabled: false,
            channel: 'none',
            message: 'none',
            embed: false,
            embedTitle: 'none',
        }
        guild.welcome = defaultObj
        await guild.save()
    }
    const welcome = guild.welcome
    if (args[1]) {
        const welcomeconfig = require('./welcomeconfig')
        return await welcomeconfig(bot, message, args, guild)
    }
    else {
        const status = (welcome.enabled !== false) ? `${config.enabled}Enabled` : `${config.disabled}Disabled`
        const channelstatus = (welcome.channel !== 'none') ? guild.welcome.channel : 'None'
        const chanstat = (channelstatus !== 'dm' && channelstatus !== 'None') ? `<#${channelstatus}>` : channelstatus
        const messagestatus = (welcome.message !== 'none') ? guild.welcome.message : 'None'
        const embedStatus = (welcome.embed === true) ? `${config.enabled}Enabled` : `${config.disabled}Disabled`
        const menuEmbed = new MessageEmbed()
        .setTitle('Welcome Menu')
        .setDescription(`Values can be configured with \`${guild.prefix}settings welcome <value>\``)
        .addField('Status', status, true)
        .addField('Channel', chanstat, false)
        .addField('Embed', embedStatus, true)
        .addField('Title', welcome.embedTitle, true)
        .addField('Message', messagestatus)
        .setFooter(`To test your welcome message you can run ${guild.prefix}settings welcome test`, guild.embedInfo.footerlogo)
        message.channel.send(menuEmbed)
    }
}