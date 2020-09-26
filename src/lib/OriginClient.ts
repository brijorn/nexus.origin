import { Client } from "discord.js";
import CommandHandler from "../handlers/CommandHandler";
import { DatabaseHandler } from "../handlers/DatabaseHandler";
import TicketManager from "../plugins/ticketing/TicketManager";
import { VerificationHandler } from "../handlers/VerificationHandler";
import { OriginHandlers } from "../typings/origin";

export default class OriginClient extends Client {
    public commands: CommandHandler = new CommandHandler(this);

    public handlers = {} as OriginHandlers

    public constructor() {
        super({
            partials:  ['MESSAGE', 'REACTION'],
            disableMentions: 'everyone',
        })
        if (process.env.TOKEN) this.login(process.env.TOKEN).catch((err) => console.log(err))
        else throw new Error('Missing Token')
    }

    public async login(token: string): Promise<string> {
        this.handlers.database = new DatabaseHandler(this)
        this.handlers.ticket = new TicketManager(this)
        this.handlers.verification = new VerificationHandler(this)
        return super.login(token)
    }
}