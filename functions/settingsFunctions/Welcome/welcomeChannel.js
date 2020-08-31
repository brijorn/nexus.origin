const substring = require('../../substring')
const embed = require('../../embed')
const editprompt = require('../../../prompt/editprompt')
const config = require('../../../config.json')
module.exports = async (bot, message, args, guild, msgToEdit) => {
    const cancelmsg = '\n\nRespond **cancel** to cancel.'
    let type = ''
    if (args[2]) {
        if (args[2] === 'dm') type = 'dm'
        else {
            sub = substring(args[2])
        if (sub === false || !message.guild.channels.cache.get(sub)) return msgToEdit.edit(embed('Invalid Channel', 'Please give a proper channel in this guild, eg: <#general>', guild, config.failure))
        type = sub
        }
    }
    if (!args[2]) {
    const askmsg = embed('Channel Configuration', `What would you like to set the welcome channel to? Give a channel or\`dm\`${cancelmsg}`, guild, '#')
    const ask = await editprompt(message, msgToEdit, askmsg, 'lower')
    if (ask === 'cancel') {
        await msgToEdit.delete({ timeout: 50 })
        return message.channel.send('Cancelled.')
    }
    if (ask === 'dm') return type = 'dm'
    else {
        const sub = substring(ask)
        if (sub === false || !message.guild.channels.cache.get(sub)) return msgToEdit.edit(embed('Invalid Channel', 'Please give a proper channel in this guild, eg: <#general>', guild, config.failure))
        type = sub
    }
}
guild.welcome.channel = type
guild.markModified('welcome')
await guild.save()
msgToEdit.edit(embed('Value Changed', 'The welcome channel has successfully been changed to ' + type, guild, config.success))

}