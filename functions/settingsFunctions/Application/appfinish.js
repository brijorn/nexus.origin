const { MessageEmbed } = require("discord.js")
const editprompt = require("../../../prompt/editprompt")
const { success } = require('../../../config.json')
const embed = require('../../embed')
const substring = require("../../substring")
module.exports = async (bot, message, guild, args, questions, name, msgToEdit) => {
    let i = 0
    let thechannel = ''
    const list = questions.map(each => `\`${++i}.\` ${each}`).join('\n')
    const channelmsg = embed('Channel', 'What channel do you want the responses of this application to be sent to?\nI need permissions to send messages and embeds there also.', guild)
    channelmsg.setFooter('This can be configured later.')
    const channel = await editprompt(message, msgToEdit, channelmsg)
    if (channel.startsWith('<#')){
        thechannel = substring(channel, 'channel')
    }
    else {
        thechannel = channel
    }
    const done = new MessageEmbed()
    .setTitle(name)
    .setDescription('Here are the questions in the application.' + `\n${list}`)
    .setFooter('If you are happy with this, say "done", if not respond "cancel"')
    const ask = await editprompt(message, msgToEdit, done, 'lower')
    if (ask === 'cancel') {
        cancel = true
        msgToEdit.delete({ timeout: 0 })
    }
    if (ask === 'done') {
        msgToEdit.edit(embed('Saving Application', 'This should take a few seconds.', guild, '#'))
        if (!guild.applications) {
            const app = {
                enabled: true,
                apps: []
            }
            guild.applications = app
            await guild.save()
        }
        const appObj = {
            name: name,
            available: true,
            channel: thechannel,
            questions: questions
        }
        guild.applications.apps.push(appObj)
        guild.markModified('applications')
        await guild.save()
        msgToEdit.edit(embed('Application Saved', `Your application,\`${name}\` has successfully saved.`, guild, success))
    }
}