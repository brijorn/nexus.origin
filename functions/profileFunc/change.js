const editprompt = require("../../prompt/editprompt")
const embed = require('../embed')
const config = require('../../config.json')
module.exports = async (bot, message, user, value, title, msgToEdit, guild) => {
    const name = title.toLowerCase()
    const cancelmsg = '\n\nRespond **cancel** to cancel.'
    const none = '\nRespond **none** to disable.'
    const askmsg = embed(`${title} Configuration`, `What would you like to set the ${name} value to?${cancelmsg}${none}`, guild, '#')
    const ask = await editprompt(message, msgToEdit, askmsg)
    if (ask.toLowerCase() === 'cancel') {
        msgToEdit.delete({ timeout: 50})
        return message.channel.send('Cancelled.')
    }
    user[value] = ask
    await user.save()
    msgToEdit.edit(embed('Value Changed', 'Successfully set the ' + name + ' value to ' + `\`${ask}\``, guild, config.success))
} 