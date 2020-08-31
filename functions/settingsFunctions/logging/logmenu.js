const { MessageEmbed } = require('discord.js')
const embed = require('../../embed')
const { enabled, disabled } = require('../../../config.json')
const prompt = require('../../../prompt/prompt')
module.exports = async (bot, message, args, guild) => {
    if (!guild.logging && !args[1]) {
        message.channel.send(embed('No Logging Settings', `This is your first time using logging, you can create the default settings by running ${guild.prefix}settings log default`, guild, '#'))
    }
    if (args[1] && args[1].toLowerCase() === 'default') {
        let cancelled = false
        if (guild.logging) {
            const msg = embed('Logging Default', 'This will wipe all your logging settings, are you sure?\nRespond `y` or `n`\nRespond **cancel** to cancel.', guild)
            let answer = await prompt(message, msg)
            answer = answer.toLowerCase()
            if (answer.startsWith('y')) {
                guild.logging = {}
                await guild.save()
            }
            else {
                cancelled = true
                return message.channel.send('cancelled')
            }
        }
            if (cancelled === false) {
                setup = {
                    enabled: true,
                    settings: [],
                }
                guild.logging = setup
                await guild.save()
                message.channel.send(embed('Logging Default Settings', 'Your moderation settings have successfully been set to the default value', guild))
            }
        }
    if (guild.logging && !args[1]) {
        let leinfo = require('../settingspages')
        const ledat = (await leinfo(bot, message, args, guild)).logInfo
        const mainpage = new MessageEmbed()
        .setTitle('Logging Menu')
        .setDescription(`To create a new logging type run the command ${guild.prefix}settings log create <name>\nTo view your setting for systems use the arrows.`)
        .setFooter(guild.embedInfo.footer, guild.embedInfo.footerlogo)
        .setColor(guild.embedInfo.color)
        .addField('Status', ledat.status)
        .addField('Enabled Settings', ledat.enabledSettings)
        .addField('Available Settings', ledat.available)
        let data = ['filler', mainpage]
        const settings =  guild.logging.settings
        function createPages() {
            for (i=0;i < guild.logging.settings.length;i++) {
                const info = settings[i]
                let available = info.available
                available = available.filter(a => !info.enabled.includes(a));
                data[i + 2] = new MessageEmbed()
                .setTitle(`${info.name} Logging`)
                .setDescription(`To edit the logging settings, run ${guild.prefix}settings log edit <name> <value>`)
                .addField('Status', (info.status === true) ? `${enabled} Enabled` : `${disabled} Disabled`, true)
                .addField('Enabled', (info.enabled.length === 0) ? 'None' : info.enabled.map(e => `${e}`).join(', '), true)
                .addField('Available', available.map(e => `${e}`).join(', '), true)
                .addField('Channel', (info.channel) ? `${info.channel} - <#${info.channel}>` : 'None')
            }
        }
        createPages()
        const pagination = require('../../../lib/forEachPagination')
        return await pagination(bot, message, args, guild, data)
    }
    if (args[1] === 'create') {
        const create = require('./logcreate')
        return await create(bot, message, args, guild)
    }
    if (args[1] === 'edit') {
        const edit = require('./logedit')
        return await edit(bot, message, args, guild)
    }
}