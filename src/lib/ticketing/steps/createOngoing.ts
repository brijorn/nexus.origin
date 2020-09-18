import { Client, Message } from "discord.js"
import GuildSettings from "../../../db/guild/types"
import { Panel } from "../../../db/ticketing/types"

export default async (bot: Client, message: Message, guild: GuildSettings, panel: Panel, inofrmation: any) => {
    let state: Boolean = false

    let ongoingObj: any = {

    }
    return {
        state,
        ongoingObj
    }
}