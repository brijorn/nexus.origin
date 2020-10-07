import { Client } from "discord.js";
import CommandHandler from "../handlers/CommandHandler";
import DatabaseHandler from "../handlers/DatabaseHandler";
import TicketManager from "../plugins/ticketing/TicketManager";
import { VerificationHandler } from "../handlers/VerificationHandler";
import { OriginHandlers } from "../typings/origin";
import EventHandler from "../handlers/EventHandler";
import CacheHandler from "../handlers/CacheHandler";
import JobHandler from "../handlers/JobHandler";
import { OriginMessage } from "./extensions/OriginMessage";

export default class OriginClient extends Client {
	public commands = new CommandHandler(this);
	public events = new EventHandler(this);
	public handlers = {} as OriginHandlers;

	public constructor() {
		super({
			partials: ["MESSAGE", "REACTION"],
			disableMentions: "everyone",
		});
		if (process.env.TOKEN)
			this.login(process.env.TOKEN).catch((err) => console.log(err));
		else throw new Error("Missing Token");
	}

	public async login(token: string): Promise<string> {
		this.handlers.database = new DatabaseHandler(this);
		this.handlers.ticket = new TicketManager(this);
		this.handlers.verification = new VerificationHandler(this);
		this.handlers.cache = new CacheHandler(this);
		this.handlers.job = new JobHandler(this);
		return super.login(token);
	}
}
