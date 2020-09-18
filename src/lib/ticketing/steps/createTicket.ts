import { Message, Client } from 'discord.js'
import GuildSettings from '../../../db/guild/types'
import { createTicket } from '../../../db/ticketing/ticket'
import { Panel } from '../../../db/ticketing/types'
import embed from '../../../functions/embed'


export default async (bot: Client, message: Message, guild: GuildSettings, panel: Panel, information: any) => {
    let state = false
    let ticket = undefined
    try {
        ticket = await createTicket(message, panel, information)
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