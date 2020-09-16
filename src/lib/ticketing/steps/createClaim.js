const { Message, MessageEmbed } = require('discord.js')
const embed = require('../../../functions/embed')
const formatEmbed = require('../functions/formatEmbed')
/**
 * 
 * @param { Message } message 
 */
module.exports = async (message, information, panel) => {
    console.log(panel.claim_channel)
    // Define
    let channel = ''
    let claimMessage = ''
    let state = true
    
    // Try
    try {
        channel = message.guild.channels.cache.get(panel.claim_channel)
    }
    catch {
        state = false
        message.channel.send(embed('none', 'There was an error getting the claim channel.',
        guild, 'failure', false, true))
    }
    if (state === false) return
    try {
        claimMessage = new MessageEmbed(await formatEmbed(panel.claim_message, message, panel, information))
    }
    catch(err) {
        state = false
        message.channel.send(embed('none', 'There was an error formatting the embed.',
        guild, 'failure', false, true))
    }
    if (state === false) return

    // Do
    const msg = await channel.send(claimMessage)
    try { msg.react(panel.claim_reaction) }
    catch { state = false; message.channel.send(embed('none', `Invalid reaction for claim message.`,
    guild, 'failure', false, true))}

    // Return
    const claimObj = {
        messageid: msg.id,
    }
    return {
        state,
        claimObj
    }
}