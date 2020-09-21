import { Client, Message } from "discord.js"
import GuildSettings from "../../../../db/guild/guild"
import { Panel } from "../../../../db/types/ticketing"

export default async (bot: Client, message: Message, guild: GuildSettings, panel: Panel, inofrmation: any) => {
    let state: Boolean = false

    let ongoingObj: any = {

    }
    return {
        state,
        ongoingObj
    }
}