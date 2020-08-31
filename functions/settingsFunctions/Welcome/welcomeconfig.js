const embed = require("../../embed")
const config = require('../../../config.json')
const editStartPrompt = require("../../../prompt/editStartPrompt")
const editprompt = require("../../../prompt/editprompt")
module.exports = async (bot, message, args, guild) => {
    const options = ['enable', 'disable', 'message', 'channel', 'description', 'embed', 'title']
    let ask = undefined
    if (!args[1]) {
        const askmsg = embed('Welcome Configuration', `What value would you like to change?\n**Options:**\`${options.join(', ')}\``, guild, '#')
        ask = await editStartPrompt(message, askmsg)
        if (!options.includes(ask.content)) return ask.message.edit(embed('Invalid Option', `Please try again with one of the following responses:\n\`${options.join(', ')}\``, guild, config.failure))
    }
    res = (args[1]) ? args[1] : ask.content
    let ques = (args[1]) ? await message.channel.send(embed('Welcome Configuration', 'Starting..', guild, '#')) : ask.message
    if (res === 'enable' || res === 'disable') {
        const which = (res === 'enable') ? true : false

        guild.welcome.enabled = which
        guild.markModified('welcome')
        await guild.save()
        ques.edit(embed('Value Change', `Successfuly ${args[1] + 'd'} welcome messages.`, guild, config.success))
    }
    if (args[1] === 'channel') {
        const welcomeChannel = require('./welcomeChannel')
        return await welcomeChannel(bot, message, args, guild, ques)
    }
    if (args[1] === 'message') {
        const welcomeMessage = require('./welcomeMessage')
        return await welcomeMessage(bot, message, args, guild, ques)
    }
    if (args[1] === 'test') {
        const test = require('./welcomeTest')
        return await test(bot, message, guild, args, ques)
    }
    if (args[1] === 'embed') {
        const enabledisable = require('../../enabledisable')
        await enabledisable(bot, message, args, guild, 'welcome', 'embed', 'embeds', ques)
    }
    if (args[1] === 'title') {
        const titleask = embed('Welcome Title', 'What would you like to set the title for the welcome embed to?\nRespond `none` for none.\nRespond `cancel` to cancel.', guild, '#')
        const datitle = await editprompt(message, ques, titleask)
        if (datitle.toLowerCase() === 'cancel') {
            ques.delete({ timeout: 1 })
            return message.channel.send('Cancelled.')
        }
        let response = datitle
        if (response.toLowerCase() === 'none') response = 'none'
        guild.welcome.embedTitle = response
        guild.markModified('welcome')
        await guild.save()
        ques.edit(embed('Value Changed', `Successfully set the embed title to ${response}`, guild, config.success))
    }
    if (!options.includes(args[1])) return ques.edit(embed('Invalid Option', `Please try again with one of the following responses:\n\`${options.join(', ')}\``, guild, config.failure))
}