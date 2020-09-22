import { Panel, GuildSettings } from "@lib/origin"

import { Message, MessageEmbed } from 'discord.js'
import embed from '../../../functions/embed'
import formatEmbed from './functions/formatEmbed'


export default async (message: Message, guild: GuildSettings, information: any, panel: Panel) => {
    console.log(panel.claim_channel)
    // Define
    let channel: any = ''
    let claimMessage: any = ''
    let state: Boolean = true
    
    // Try
    try {
        channel = message.guild!.channels.cache.get(panel.claim_channel.toString())
    }
    catch {
        state = false
        message.channel.send(embed('none', 'There was an error getting the claim channel.',
        guild, 'failure', false, true))
    }
    if (state === false) return
    try {
        claimMessage = new MessageEmbed(await formatEmbed(panel.claim_message, message, panel, information))
    }
    catch(err) {
        state = false
        message.channel.send(embed('none', 'There was an error formatting the embed.',
        guild, 'failure', false, true))
    }
    if (state === false) return

    // Do
    const msg = await channel.send(claimMessage)
    try { msg.react(panel.claim_reaction) }
    catch { state = false; message.channel.send(embed('none', `Invalid reaction for claim message.`,
    guild, 'failure', false, true))}

    // Return
    const claimObj = {
        messageid: msg.id,
    }
    return {
        state,
        claimObj
    }
}