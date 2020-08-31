const editStartPrompt = require("../../prompt/editStartPrompt")
const embed = require("../embed")
const changeval = require('./change')
const state = require('./state')
const enabledisable = require('../enabledisable')
const config = require('../../config.json')
const editprompt = require("../../prompt/editprompt")
module.exports = async (bot, message, args, guild, profile, user) => {
    let start = undefined
    const cancelmsg = '\n\nRespond **cancel** to cancel.'
    const opt = ['description', 'status', 'thumbnail', 'primaryGroup', 'presence']
        const options = opt.map(each => `${each}`).join(', ')
    if (!args[1]) {
        const startmsg = await embed('Profile Configuration', `What value would you like to change?\n**Options:**\n\`${options}\`${cancelmsg}`, guild, '#')
        start = await editStartPrompt(message, startmsg)
        start.content = start.content.toLowerCase()
        if (start.content === 'cancel') {
            await start.message.delete({ timeout: 50 })
            return message.channel.send('Cancelled.')
        }
        if (!opt.includes(start.content)) return start.message.edit(embed('none', 'Cancelled: Invalid option given.', guild, "#"))
    }
    const res = (args[1]) ? args[1].toLowerCase() : start.content
    const ques = (args[1]) ? await message.channel.send(embed('Profile Configuarion', 'Configuration Starting', guild, '#')) : start.message
        if (res.startsWith('desc')) {
            await changeval(bot, message, profile, 'profileDesc', 'Description', ques, guild)
            return
        }
        if (res.startsWith('primary')) {
            return await state(bot, message, guild, profile, user, 'primary', ques)
        }
        if (res === 'status') {
            const status = require('./status')
            return await status(bot, message, guild, profile, ques)
        }
        if (res.startsWith('thumb')) {
            const thumbnail = require('./thumbnail')
            return await thumbnail(bot, message, guild, profile, ques)
        }
        if (res === 'presence') {
            const msg = embed('Presence Configuration', 'Would you like to `enable` or `disable` presence on your profile?\n*This is showing what you are doing on roblox for example `Playing <game>`*', guild, '#')
            const setting = await editprompt(message, ques, msg, 'lower')
            if (setting === 'enable' || 'true') {
                profile.presence = true
                await profile.save()
                return ques.edit(embed('Presence Configured', 'Successfully enabled presences on your profile.', guild, config.success))
            }
            if (setting === 'disable' || 'false') {
                profile.presence = false
                await profile.save()
                return ques.edit(embed('Presence Configured', 'Successfully disabled presences on your profile.', guild, config.success))
            }
            else {
                return ques.edit(embed('Configuration Cancelled', guild, '#'))
            }
        }
        else {
            ques.delete({ timeout: 1000 })
        }
}