const editStart = require('../../../prompt/editStartPrompt')
const embed = require('../../embed')
const { MessageEmbed } = require('discord.js')
const config = require('../../../config.json')
module.exports = async (bot, message, guild) => {
    let done = false;
    const authUser = message.author.id
    const channel = message.channel

    const confirmation = new MessageEmbed()
    .setTitle('Confirmation')
    .setDescription('Are you sure you would like to create a new session for this guild?\n\n Respond `yes` or `no`')
    const confirm = await editStart(message, confirmation)
    if (!confirm || confirm.content !== 'yes' && confirm.content !== 'y') return message.channel.send(embed('none', 'Cancelled', guild))
    const information = new MessageEmbed()
    .setTitle('Creation Main Menu')
    .setDescription(`Say the name of the field to edit it\n Key: ${config.disabled} Required, ${config.enabled} Optional`)
    .addField(`${config.disabled}Session Name`, 'N/A', false)
    .addField(`${config.disabled}Message Title`, 'N/A', true)
    .addField(`${config.disabled}Message Description`, `N/A`, true)
    .addField(`${config.disabled}Author`, 'Say name for Info', true)
    .addField(`${config.enabled}Thumbnail`, 'N/A', true)
    .addField(`${config.enabled}Image`, 'N/A', true)
    .addField(`${config.enabled}Footer`, 'N/A', true)
    .addField(`${config.disabled}Messages`, 'Say name for Info', true)
    .setFooter('When finished respond with done or cancel to cancel.')
    await confirm.message.edit(information)
    const options = require('../session/sessionOptions')
    const optionInfo = await options(message, confirm.message, guild)
    if (optionInfo.cancel === true) return
    if (optionInfo.done === true && optionInfo.cancel === false) {
        const sessionSave = require('./sessionSave')
        await sessionSave(bot, message, guild, optionInfo.authorinfo, optionInfo.messageinfo, confirm.message)
    }
}