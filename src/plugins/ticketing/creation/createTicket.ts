import OriginClient from '../../../lib/OriginClient'
import { Message, Client } from 'discord.js'
import { Panel, GuildSettings, Ticket } from '../../../typings/origin'
import embed from '../../../functions/embed'


export default async (bot: OriginClient, message: Message, guild: GuildSettings, panel: Panel, information: any) => {
    console.log(information)
    let state = false
    const newTicket = await bot.handlers.ticket.ticket.create(message.guild!.id, panel, information)
    state = true
    const ticketObj = {
        ticketid: newTicket.ticket_id
    }
    return {
        state,
        ticketObj
    }
}