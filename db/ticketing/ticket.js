const db = require('../')
const { Message } = require('discord.js')
/**
 * 
 * @param { Message } message 
 */
exports.createTicket = async function(message, panel, information, claimObj) {
    const ticket = await db.withSchema('ticketing').table('tickets')
    .returning('*')
    .insert({
        // Ids
        guild_id: message.guild.id,
        ticket_id: parseInt(panel.ticket_count) + 1,
        interface_id: panel.interface_id,

        // Ticket Status
        status: 'ongoing',

        // User
        ticket_user: message.author.id,

        // IDS
        channel_id: information.chanelid,
        message_id: information.mainmessage,
        // Information
        ticket_title: information.title,
        ticket_description: information.description,
        // Claim Information
        ticket_claimer: (claimObj) ? claimObj.claimer.id : null,
        claim_timestamp: (claimObj) ? Date.now() : null,
        // Timestamps
        open_timestamp: (claimObj) ? claimObj.open_timestamp : Date.now()

    })
    .then(data => { return data[0] })
    return ticket
}

/**
 * 
 * @param { Message } message 
 */
exports.getTicket = async function(message, ticket_id) {
    const ticket = await db.withSchema('ticketing').table('tickets')
    .where('guild_id', '=', message.guild.id)
    .where('ticket_id', '=', ticket_id)
    .first()

    return ticket
}