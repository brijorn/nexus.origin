"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicket = exports.createTicket = void 0;
const db = require('../');
async function createTicket(message, panel, information) {
    const ticket = await db.withSchema('ticketing').table('tickets')
        .returning('*')
        .insert({
        // Ids
        guild_id: message.guild.id,
        ticket_id: parseInt(panel.ticket_count.toString()) + 1,
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
        ticket_claimer: (information.claimed === true) ? information.claimer.id : null,
        claim_timestamp: (information.claimed === true) ? Date.now() : null,
        // Timestamps
        open_timestamp: (information.claimed === true) ? information.open_timestamp : Date.now()
    })
        .then((data) => { return data[0]; });
    return ticket;
}
exports.createTicket = createTicket;
async function getTicket(message, ticket_id) {
    const ticket = await db.withSchema('ticketing').table('tickets')
        .where('guild_id', '=', message.guild.id)
        .where('ticket_id', '=', ticket_id)
        .first();
    return ticket;
}
exports.getTicket = getTicket;
