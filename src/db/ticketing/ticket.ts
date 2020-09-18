import { Message } from "discord.js"
import { Panel } from "./types"

const db = require('../')


export async function createTicket(message: Message, panel: Panel, information: any) {
    const ticket = await db.withSchema('ticketing').table('tickets')
    .returning('*')
    .insert({
        // Ids
        guild_id: message.guild!.id,
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
    .then((data: any) => { return data[0] })
    return ticket
}

export async function getTicket(message: Message, ticket_id: any) {
    const ticket = await db.withSchema('ticketing').table('tickets')
    .where('guild_id', '=', message.guild!.id)
    .where('ticket_id', '=', ticket_id)
    .first()

    return ticket
}