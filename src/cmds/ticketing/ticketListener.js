const { Client, Message } = require('discord.js')
const errors = require('../../lib/errors')
const { getPanel } = require('../../db/ticketing/panel')
const setReactionMessage = require('../../lib/ticketing/steps/misc/setReactionMessage')
/**
 * 
 * @param { Client } bot 
 * @param { Message } message 
 * @param { Array } args 
 * @param { Object } guild 
 */
module.exports.run = async (bot, message, args, guild) => {
    if (!args[0]) return message.channel.send('Missing Panel Name')
    const name = (args.length > 1) ? args.slice(0).join(' ') : args[0]
    const panel = await getPanel(message, name)
    if (!panel) return message.channel.send('Panel not Found')
    await setReactionMessage(bot, message, guild, panel)
}

module.exports.help = {
    name: 'ticketlistener',
    aliases: ['ticketembed'],
    description: 'Messages to create tickets when reacted with the specified emoji',
    module: 'ticketing'
}