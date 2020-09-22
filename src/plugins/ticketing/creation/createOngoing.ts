import { Client, Message } from "discord.js"
import { Panel, GuildSettings } from "@lib/origin"

export default async (bot: Client, message: Message, guild: GuildSettings, panel: Panel, inofrmation: any) => {
    let state: Boolean = false

    let ongoingObj: any = {

    }
    return {
        state,
        ongoingObj
    }
}