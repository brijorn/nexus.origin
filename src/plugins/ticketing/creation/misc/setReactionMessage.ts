import { GuildSettings, Panel } from "typings/origin"
import { Client, Message, MessageEmbed, TextChannel } from "discord.js"

import embed from '../../../../functions/embed'
import { editStart, editPrompt } from '../../../../prompt'
import { channel } from '@lib/util/parse'
import { updatePanel } from '../../../../db/ticketing/panel'


export default async (bot: Client, message: Message, guild: GuildSettings, panel: Panel) => {
    const start = await new editStart(
        message,
        embed('Ticket Reaction Listener',
        'What is the channel the message is in?\n\nRespond **cancel** to cancel.',
        guild, '', false, false
        )).init()
    if (!start) return start!.message.delete({ timeout: 5000 })
    if (start!.content.toLowerCase() === 'cancel') return start!.message.delete({ timeout: 5000 })
    let getChannel = await channel(bot, message, start.content)
    if (getChannel!.state === false) return start.message.edit(embed('Error', `Channel Not Found`, guild, 'failure', false, true)).then(m => 
        m.delete({ timeout: 10000 } ))
    
    const channelId = getChannel!.value
    const foundChannel = await message.guild!.channels.cache.get(channelId)?.fetch() as TextChannel

    const msg = await editPrompt(
        message,
        start.message,
        embed('Ticket Reaction Listener',
        `What is the id of the message? You can also respond \`default\` to send a default reaction message or give \`JSON\` data.
        \nRespond **cancel** to cancel.`,
        guild, '', false, false)) as any;
    
    if (msg.toLowerCase() === 'cancel') return start.message.delete({ timeout: 5000 })
    let foundMessage: any = '';
    if (isNaN(msg) === false) {
        try { foundMessage = foundChannel!.messages.cache.get(msg); foundMessage.react(panel.create_reaction) }
        catch { return message.channel.send(embed('Error', `Message ${msg} could not be found in the channel <#${foundChannel!.id}>`, guild, 
        'failure', false, true))}
    }
    if (msg.toLowerCase() === 'default') {
        foundMessage = await foundChannel!.send(embed(`${panel.interface_name} Ticket`, `React to open a ${panel.interface_name} ticket`,
        guild, 'defualt', true))
        .then(m => m.react(panel.create_reaction))
    }
    else {
        let parsed = JSON.parse(msg)
        console.log(parsed.embeds[0])
        foundMessage = new MessageEmbed(parsed.embeds[0])
        foundMessage = await foundChannel.send((parsed.content) ? parsed.content : '', foundMessage)
    }

    await updatePanel(message, panel.interface_name, ['message_id'], [foundChannel!.id])
    start.message.edit(embed(
        'Reaction Listener Updated',
        `The reaction listener has been set to the message \`${foundMessage.id}\` and the reaction \`${panel.create_reaction}\``,
        guild, 'success', false, false
    ))
    return start.message.delete({ timeout: 20000 })
 
}