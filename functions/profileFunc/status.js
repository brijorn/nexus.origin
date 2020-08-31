const embed = require("../embed")
const editprompt = require("../../prompt/editprompt")
const config = require('../../config.json')
module.exports = async (bot, message, guild, profile, msgToEdit) => {
    const awayemoji = '<:away:741320431218327612>'
    const busyemoji = '<:busy:741326502095749302>'
    const offlineemoji = '<:offline:741320452755947621>'
    const onlineemoji = '<:online:741320388893605948>'
    let msgToSave = ''
    const opt = ['away', 'online', 'busy', 'offline', 'none', 'cancel']
    const options = opt.slice(0, 4)
    const cancelmsg = '\n\nRespond **cancel** to cancel.'
    const asksmg = embed('Status Configuration', `What would you like to set your status to?\n**Options:** \`${options.join(', ')}\`${cancelmsg}\n\nRespond with **none** to disable\nRespond **cancel** to cancel`, guild, '#')
    const ask = await editprompt(message, msgToEdit, asksmg, 'lower')
    if (!opt.includes(ask)) return msgToEdit.edit(embed('Invalid Option', `Invalid response, please try again with one of the following: \`${options.join(', ')}\``, guild, config.failure))

    // Cancelling if they say cancel.
    if (ask === 'cancel') {
        msgToEdit.delete({ timeout: 10 })
        if (invalid) invalid.delete({ timeout: 10 })
        askstatus = 'cancel'
        return message.channel.send('Cancelled')
    }

    // Seeing what they said and adding the emoji or if it's none, disabling it.
    if (ask === 'none') msgToSave = 'none'
    if (ask === 'online') msgToSave = `${onlineemoji}Online`
    if (ask === 'busy') msgToSave = `${busyemoji}Busy`
    if (ask === 'offline') msgToSave = `${offlineemoji}Offline`
    if (ask === 'away') msgToSave = `${awayemoji}Away`

    msgToEdit.edit(embed('Value Changed', `Successfully set your status to \`${ask}\``, guild, config.success))
    profile.status = msgToSave
    await profile.save()
}