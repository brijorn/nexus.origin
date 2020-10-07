import { Panel } from "../../typings/origin.d";
import OriginClient from "../../lib/OriginClient";
import { OriginMessage } from "../../lib/extensions/OriginMessage";
import { Message } from "discord.js";
import { TicketCommandCreateData } from "./TicketManager";

// Parts
import GetTitleAndDescription from './TitleAndDescription'
import CreateTicketChannel from './CreateTicketChannel'
export default async (bot: OriginClient, message: OriginMessage, panel: Panel): Promise<void|Message> => {
    if (!message.guild) return message.error('Error executing. Try running the command again.')
    // Basic User Information
    let ticketInformation: TicketCommandCreateData = {
            user_name: message.author.username + '#' + message.author.discriminator,
            user_id: message.author.id,
            user_avatar: message.author.avatarURL() || '',
            title: 'none',
            description: 'none',
            channel_id: '0',
            menu_id: '0'
    }

    // Run each of the steps for ticket creation
    const TitleAndDescription = await GetTitleAndDescription(message, panel, 'command')
    // Return if its a message because that means it errored
    if (TitleAndDescription instanceof Message) return
    ticketInformation = JoinObjects(ticketInformation, TitleAndDescription)

    const createChannel = await CreateTicketChannel(message.guild, message.author, panel, 'command', ticketInformation, message)
    if (createChannel instanceof Message) return
    ticketInformation = JoinObjects(ticketInformation, TitleAndDescription)



}

function JoinObjects(main: TicketCommandCreateData, objToJoin: Record<string, string>) {
    for (const [key, value] of Object.entries(objToJoin)) {
        main[key] = value
    }
    return main
}