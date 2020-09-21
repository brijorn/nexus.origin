import embed from "../../../../functions/embed"
import { Channel, Client, Message, MessageEmbed, TextChannel } from 'discord.js'
import GuildSettings from "../../../../db/guild/guild"
import { Panel } from "../../../../db/types/ticketing"

export default async (bot: Client, message: Message, guild: GuildSettings, panel: Panel, information: any) => {
    const content = (panel.claim_system === true) ? `Your ticket has successfully been submitted. You will be notified when someone has tkaen it` :
    `Your ticket has successfully been created in the channel <#${information.channelid}>`
    const dm = (information.type === 'command') ? panel.command_dm_prompt : panel.create_dm_prompt  
    const msg = embed('Ticket Successfully Created', content, guild, 'success', (dm === true) ?`Message from ${message.guild!.name}` : false, true)
    try {
    if (dm === true) message.author.send(msg)
    else message.channel.send(msg)
    }
    catch {
        message.channel.send('Ticket Created but had error dming user.')
    }
    // Check if Logging Is Enabled and the channel is valid cause some people are idiots and delete channels :sweats:
    if (panel.log_open === true && message.guild!.channels.cache.get(panel.log_channel.toString())) {
        // Get the channel
        const channel = message.guild!.channels.cache.get(panel.log_channel.toString()) as TextChannel
        
        // Make the sexy embed
        const logmessage = new MessageEmbed()
        .setTitle(`New ${panel.interface_name} Ticket Opened`)
        .addField('Title', information.title, true)
        .addField('Description', information.description, true)
        .addField('User', message.author, true)
        .setFooter(`UserID: ${message.author.id}`)
        channel.send(logmessage)
    }

}