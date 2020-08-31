const embed = require('../embed')
const config = require('../../config.json')
const substring = require('../substring')
module.exports = async (bot, message, guild, args) => {
    const firstargs = ['enable', 'disable', 'cooldown']
    if (!firstargs.includes(args[1])) return message.channel.send(embed('none', 'Missing Arguments\n\nSyntax: `settings suggestion <enable, disable, cooldown> <#channel>`\n Tip: You do not need to give a channel when disabling.', guild, config.failure))
    if (!guild.suggestionInfo) {
        guild.suggestionInfo = {
            enabled: false,
            channel: '',
            cooldown: 20
        }
        await guild.save()
    }
    if (args[1] === 'disable') {
        message.channel.send(embed('none', `${config.disabled} Successfully disabled suggestions for your guild.`, guild, config.success))
        guild.suggestionInfo = {
            enabled: false,
        }
        guild.markModified('suggestionInfo')
        await guild.save()
    }
    if (args[1] === 'enable') {
        if (args[2].startsWith('<#') === false) return message.channel.send(embed('none', 'Missing Arguments\n\nSyntax: `settings suggestion <enable, disable> <#channel>`\n Tip: You do not need to give a channel when disabling.', config.failure))
        const finishedchannel = await substring(args[2], 'channel')
        if (finishedchannel === false) return message.channel.send('Channel Error', 'Invalid Channel Given.', config.failure)
        if (!message.guild.channels.cache.get(finishedchannel)) return message.channel.send(embed('none', 'Could not find given channel.', config.failure))
        message.channel.send(embed('none', 'Successfully enabled Suggestions for ' + '<#' + finishedchannel + '>', guild, config.success))
        guild.suggestionInfo = {
            enabled: true,
            channel: finishedchannel
        }
        guild.markModified('suggestionInfo')
        await guild.save()
    }
    if (args[1].includes('cooldown')) {
        if (!args[2]) return message.channel.send(embed('none', 'Please give a time in seconds for the cooldown.', guild, config.failure))
        if (isNaN(args[2]) === true) return message.channel.send(embed('none', 'The cooldown time must be a number in seconds.', guild, config.failure))
        guild.suggestionInfo.cooldown = args[2] * 1000
        guild.markModified('suggestionInfo')
        await guild.save()
        message.channel.send(embed('none', 'Successfully set the cooldown time to ' + `\`${args[2]}\``, guild, config.success))
    }
}