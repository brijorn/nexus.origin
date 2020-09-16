const { Message, Client } = require('discord.js')
const tickets = require('../../../db/ticketing/ticket')
const embed = require('../../../functions/embed')
/**
 * 
 * @param { Client } bot 
 * @param { Message } message 
 */
module.exports = async (bot, message, guild, panel, information, type) => {
    let state = false
    let ticket = undefined
    try {
        ticket = await tickets.createTicket(message, panel, information)
        console.log(ticket)
    }
    catch(err) {
        message.channel.send(embed('Error',
        `An error has occured while saving the ticket. This may be an issue with your panel. If not, contact a developer\n\`Error: ${err.message}\``,
        guild, 'failure', false, true))
        return state
    }
    state = true
    const ticketObj = {
        ticketid: ticket.ticket_id
    }
    return {
        state,
        ticketObj
    }
}