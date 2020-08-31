const editStart = require('../prompt/editStartPrompt')
const embed = require('../functions/embed')
const config = require('../config.json')
const editStartPrompt = require('../prompt/editStartPrompt')
const editprompt = require('../prompt/editprompt')

module.exports = async (bot, message, args, guild, directory, setting, name, msgToEdit) => {
    if (args[2]) {
        arg2low = args[2].toLowerCase()
        if (arg2low !== 'enable' && arg2low !== 'disable') return message.channel.send(embed('none', 'You can only set this value to `true` or `false`.', guild, config.failure))
        const value = (arg2low === 'enable') ? true : false
            guild[directory][setting] = value
            guild.markModified(directory)
            await guild.save()
            const embedval = (value === true) ? embed('none', config.enabled + `Successfully enabled ${name}.`, guild, config.success) : embed('none', config.disabled + `Successfully disabled ${name}.`, guild, config.success)
            const sender = (msgToEdit) ? msgToEdit.edit(embedval) : message.channel.send(embedval)
    }
    if (!args[2]) {
        const startembed = embed('none', `What would you like to set the  ${name} value to?\nOptions: \`enable\` or \`disable\``, guild, '#')
        const start = (msgToEdit) ? await editprompt(message, msgToEdit, startembed) : await editStart(message, startembed)
        const arg2low = (msgToEdit) ? start.toLowerCase() : start.content.toLowerCase()
        if (arg2low !== 'enable' && args2low !== 'enable') return message.channel.send(embed('none', 'You can only set this value to `true` or `false`.', guild, config.failure))
        const value = (arg2low === 'enable') ? true : false
        guild[directory][setting] = value
            guild.markModified(directory)
            await guild.save()
            const embedval = (value === true) ? embed('none', config.enabled + `Successfully enabled ${name}.`, guild, config.success) : embed('none', config.disabled + `Successfully disabled ${name}.`, guild, config.success)
            const sender = (msgToEdit) ? msgToEdit.edit(embedval) : start.message.edit(embedval)
    }
}