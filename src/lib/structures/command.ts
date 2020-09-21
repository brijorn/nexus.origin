import { Client, Message } from "discord.js";
import GuildSettings from "../../db/guild/guild";

export class Command {
    bot: Client;
    guild: GuildSettings;

    name!: string;
    args: string[];

    module!: string;
    aliases: string[] | undefined;
    syntax: string[] | undefined;
    description: string | undefined;
    inDepth: string | undefined;
    slice: boolean | undefined;

    constructor(bot: Client, guild: GuildSettings, args: string[]) {
        this.bot = bot,
        this.guild = guild,
        this.args = args
    }
    execute(_message: Message, _args: string[]) { 
        throw new Error('Hello')
    }
}