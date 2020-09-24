import { Client } from "discord.js";
import CommandHandler from "../handlers/CommandHandler";
import { DatabaseHandler } from "../handlers/DatabaseHandler";
import TicketHandler from "../handlers/TicketHandler";
import { VerificationHandler } from "../handlers/VerificationHandler";
interface OriginHandlers {
    database: DatabaseHandler,
    ticket: TicketHandler,
    verification: VerificationHandler
}
export default class OriginClient extends Client {
    public commands: CommandHandler = new CommandHandler(this);

    public handlers = {} as OriginHandlers

    public constructor() {
        super({
            partials:  ['MESSAGE', 'REACTION'],
            disableMentions: 'everyone',
        })
        this.login(process.env.TOKEN!).catch((err) => console.log(err))
    }

    public async login(token: string): Promise<string> {
        this.handlers.database = new DatabaseHandler(this)
        this.handlers.ticket = new TicketHandler(this)
        this.handlers.verification = new VerificationHandler(this)
        return super.login(token)
    }
}