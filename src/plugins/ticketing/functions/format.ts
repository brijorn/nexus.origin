import { MessageReaction, User } from "discord.js";
import { Panel } from "../../../typings/origin.d";
import { OriginMessage } from "../../../lib/extensions/OriginMessage";
import formats from './formats.json'
export default async (value: string, panel: Panel, type: 'reaction' | 'command', message?: OriginMessage, reaction?: MessageReaction, user?: User): Promise<string> => {
    formats.forEach(format => {
        if (value.includes(format.name)) {
            value = value.replace(new RegExp(format.name, "g"), eval(format.changeto))
        }
    });
    return value
}