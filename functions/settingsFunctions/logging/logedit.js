const embed = require("../../embed")
const editStartPrompt = require("../../../prompt/editStartPrompt")
const editprompt = require("../../../prompt/editprompt")
const { success, failure } = require('../../../config.json')
module.exports = async (bot, message, args, guild) => {
    const systems = guild.logging.settings
    const options = ['status', 'channel', 'enable', 'disable']
    async function Change(system, value, newval) {
        value = value.toLowerCase()
        newval = newval.toLowerCase()
        if (value === 'enable') {
            const sysopt = system.available
            if (!sysopt.includes(newval)) return message.channel.send(embed('none', `Invalid Value, Available options:\n\`${sysopt.map(e => `${e}`).join(', ')}\``, guild, failure))
            if (system.enabled.includes(newval)) return message.channel.send(embed('none', 'Setting already enabled', guild, failure))
            system.enabled.push(newval)
            guild.markModified('logging')
            await guild.save()
            return message.channel.send(embed(`Logging Changed`,`Successfully enabled \`${newval}\` for ${system.name}`, guild, success))
        }
        if (value === 'disable') {
            const sysopt = system.available
            if (!sysopt.includes(newval)) return message.channel.send(embed('none', `Invalid Value, available options:\n\`${system.enabled.map(e => `${e}`).join(', ')}\``, guild, failure))
            if (!system.enabled.includes(newval)) return message.channel.send(embed('none', 'Setting is not enabled', guild, failure))
            system.enabled.splice(system.enabled.indexOf(newval), 1)
            guild.markModified('logging')
            await guild.save()
            return message.channel.send(embed(`Logging Changed`, `Successfully disabled \`${newval}\` for ${system.name}`, guild, success))
        }
        if (value === 'channel') {
            const channelparser = require('../../substring')
            const channel = channelparser(newval, 'channel')
            if (!message.guild.channels.cache.get(channel)) return message.channel.send(embed('none', 'Channel Not Found', guild, failure))
            system.channel = channel
            guild.markModified('logging')
            await guild.save()
            return message.channel.send(embed(`Logging Changed`, `Successfully set the channel to <#${channel}> for ${system.name}`, guild, success))
        }
    }
    if (!args[2]) {
        let msg = embed('Logging Configuration', 'What log would you like to configure?', guild, '#')
        const start = await editStartPrompt(message, msg)
        if (!systems.find(e => e.name === start.content)) return start.message.edit(embed('none', 'Given system not found', guild, '#'))
        const system = systems.find(e => e.name === start.content)
        msg = embed('Logging Configuration', `What value would you like to change?\navailable options:\n\`${options.map(e => `${e}`).join(', ')}\``, guild, '#')
        const value = await editprompt(message, start.message, msg, 'lower')
        if (!options.includes(value)) return message.channel.send(embed('none', `Invalid Value, available options:\n\`${options.map(e => `${e}`).join(', ')}\``, guild, failure))
        let con = (value === 'enable') ? `What values would you like to enable?\nOptions: ${system.available.map(e => `${e}`).join(', ')}` : 'potato'
        con = (value === 'disable') ? `What values would you like to enable?\nOptions: \`${system.enabled.map(e => `${e}`).join(', ')}\`` : con
        con = (value === 'channel') ? 'What would you like to set the channel to?' : con
        msg = embed('Logging Configuration', con, guild, '#')
        const newval = await editprompt(message, start.message, msg, 'lower')

        return await Change(system, value, newval)
    }
    if (args[2]) {
        args = args.map(e => e.toLowerCase())
        if (!systems.find(e => e.name === args[2].toLowerCase())) return message.channel.send(embed('none', 'Given system not found', guild, '#'))
        const system = systems.find(e => e.name === args[2].toLowerCase())
        if (!args[3] || !options.includes(args[3])) return message.channel.send(embed('none', `Invalid Value, available options:\n\`${options.map(e => `${e}`).join(', ')}\``, guild, failure))
        if (!args[4]) return message.channel.send(embed('none', 'Missing new value.', guild, failure))

        return await Change(system, args[3], args[4])
    }
}