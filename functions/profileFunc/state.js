const editprompt = require("../../prompt/editprompt")
const embed = require("../embed")
const config = require('../../config.json')
module.exports = async (bot, message, guild, profile, user, type, msgToEdit) => {
    const cancelmsg = '\n\nRespond **cancel** to cancel.'
    if (type === 'primary') {
        const askmsg = embed('Primary Configuration', 'Would you like to `enable` or `disable` showing your primary group on your profile?', guild, '#')
        const ask = await editprompt(message, msgToEdit, askmsg, 'lower')

        if (ask === 'cancel') {
            msgToEdit.delete({ timeout: 10 })
            if (invalid) invalid.delete({ timeout: 10 })
            askstatus = 'cancel'
            return message.channel.send('Cancelled')
        }
        if (ask !== 'enable' && ask !== 'disable') {
        const error = await message.channel.send(embed('none', 'Invalid Response, respond with `enable` or `disable`.', guild, '#'))
        msgToEdit.delete({ timeout: 10 })
        return error.delete({ timeout: 5000 })
        }
        const option = (ask === 'enable') ? true : false
        profile.primaryGroup = option
        await profile.save()
        const value = (option === true) ? 'enabled' : 'disabled'
        return msgToEdit.edit(embed('Value Changed', `Successfully ${value} primaryGroup on your profile`, guild, config.success))

}

}