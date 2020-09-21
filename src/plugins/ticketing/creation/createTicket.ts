import { Message, Client } from 'discord.js'
import { FetchedPanel, GuildSettings, Ticket } from '@lib/origin'
import embed from '../../../functions/embed'


export default async (bot: Client, message: Message, guild: GuildSettings, panel: FetchedPanel, information: any) => {
    console.log(information)
    let state = false
    const newTicket = await new Ticket().create(message.guild!.id, panel, information)
    state = true
    const ticketObj = {
        ticketid: newTicket.ticket_id
    }
    return {
        state,
        ticketObj
    }
}