const { Message, MessageEmbed } = require('discord.js')
const embed = require('../../../../functions/embed')
const { editStart, editPrompt } = require('../../../../prompt/')
const { channel } = require('../../../parse')
const { updatePanel } = require('../../../../db/ticketing/panel')
/**
 * 
 * @param { Message } message 
 * @param { Object } panel 
 */
module.exports = async (bot, message, guild, panel) => {
    const start = await editStart(
        message,
        embed('Ticket Reaction Listener',
        'What is the channel the message is in?\n\nRespond **cancel** to cancel.',
        guild, '', false, false
        ))
    if (start.content.toLowerCase() === 'cancel') return start.message.delete({ timeout: 5000 })
    let getChannel = await channel(bot, message, start.content)
    if (getChannel.found === false) return start.message.edit(embed('Error', `Channel Not Found`, guild, 'failure', false, true)).then(m => 
        m.delete({ timeout: 10000 } ))
    
    getChannel = getChannel.pre
    getChannel = message.guild.channels.cache.get(getChannel)
    const msg = await editPrompt(
        message,
        start.message,
        embed('Ticket Reaction Listener',
        `What is the id of the message? You can also respond \`default\` to send a default reaction message or give \`JSON\` data.
        \nRespond **cancel** to cancel.`,
        guild, '', false, false))
    if (msg.toLowerCase() === 'cancel') return start.message.delete({ timeout: 5000 })
    let foundMessage = ''
    if (isNaN(msg) === false) {
        try { foundMessage = getChannel.messages.cache.get(msg); foundMessage.react(panel.message_reaction) }
        catch { return message.channel.send(embed('Error', `Message ${msg} could not be found in the channel <#${getChannel.id}>`, guild, 
        'failure', false, true))}
    }
    if (msg.toLowerCase() === 'default') {
        foundMessage = await getChannel.send(embed(`${panel.interface_name} Ticket`, `React to open a ${panel.interface_name} ticket`,
        guild, 'defualt', true))
        .then(m => m.react(panel.message_reaction))
    }
    else {
        let parsed = JSON.parse(msg)
        console.log(parsed.embeds[0])
        foundMessage = new MessageEmbed(parsed.embeds[0])
        foundMessage = await getChannel.send((parsed.content) ? parsed.content : '', foundMessage)
    }

    await updatePanel(message, panel.interface_name, ['message_id'], [getChannel.id])
    start.message.edit(embed(
        'Reaction Listener Updated',
        `The reaction listener has been set to the message \`${foundMessage.id}\` and the reaction \`${panel.message_reaction}\``,
        guild, 'success', false, false
    ))
    return start.message.delete({ timeout: 20000 })
 
}