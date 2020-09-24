import { Client, Message } from "discord.js";
import { GuildSettings } from "../../typings/origin";
/**
 * Command Builder for all Commands
 */
export default class Command {
    bot: Client;
    name: string;
    aliases: string[];
    description: string;
    inDepthDescription: string;
    syntax: string[];
    constructor(bot: Client, name: string, options?: CommandOptionalParams) {
        this.bot = bot;
        this.name = name;
        this.aliases = options!.aliases || [];
        this.description = options!.description || '';
        this.inDepthDescription = options!.inDepthDescription || '';
        this.syntax = options!.syntax || [];

    }

    run(_message: Message, _args: string[], _guild: GuildSettings) {
        throw new Error('Idiot It doesnt work')
    }
}

/**
 * Optional Params not Needed
 */
interface CommandOptionalParams {
    aliases?: string[];
    description?: string;
    inDepthDescription?: string;
    syntax?: string[];

}