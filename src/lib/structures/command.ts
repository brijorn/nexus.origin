import { GuildSettings } from "../../typings/origin";
import OriginClient from "../OriginClient";
import { OriginMessage } from "../extensions/OriginMessage";
/**
 * Command Builder for all Commands
 */
export default class Command {
    bot: OriginClient;
    public readonly name: string;
    public readonly aliases: string[];
    public readonly description: string;
    public readonly inDepthDescription: string;
    public readonly syntax: string[];
    public readonly includeCommand?: boolean;
    public readonly cooldown?: number;
    public module!: string;
    constructor(bot: OriginClient, info: CommandParams) {
        this.bot = bot;
        this.name = info.name;
        this.aliases = info.aliases || [];
        this.description = info.description || '';
        this.inDepthDescription = info.inDepthDescription || '';
        this.syntax = info.syntax || [];
        this.includeCommand = info.includeCommand || false;
        this.cooldown = info.cooldown || 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    run(_message: OriginMessage, _args: string[], _guild: GuildSettings): Promise<unknown> | undefined {
        throw new Error('Idiot It doesnt work')
    }

}

/**
 * Optional Params not Needed
 */
interface CommandParams {
    name: string;
    aliases?: string[];
    description?: string;
    inDepthDescription?: string;
    syntax?: string[];
    includeCommand?: boolean;
    cooldown?: number;
}