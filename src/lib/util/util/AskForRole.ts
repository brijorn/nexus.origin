import { Client, Message, Role } from 'discord.js'
import { parse } from 'dotenv/types'
import GuildSettings from '../../../db/guild/guild'
import embed from '../../../functions/embed'
import { editStart, editPrompt, startPromptInterface } from '../../../prompt/index'
import { role } from '../parse/index'

export default async (bot: Client, message: Message, guild: GuildSettings, value: any, { title, name }: {title?: string, name?: string}) => {
    let state: boolean = false
    let role: Role
    const startPrompt = await new editStart().init(message, embed(
        `${title} Role Change`,
        `What would you like to set the ${name} role to?\n\nRespond **cancel** to cancel.`,
        guild, '', false, false
    ))
    if (startPrompt!.content.toLowerCase() === 'cancel') return startPrompt!.message.delete({ timeout: 5000 })

}