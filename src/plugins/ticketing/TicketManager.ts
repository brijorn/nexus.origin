import { MessageReaction, User } from "discord.js";
import OriginClient from "../../lib/OriginClient";
import OriginMessage from "../../lib/extensions/OriginMessage";
import { Panel, Ticket, unClaimedTicket } from "../../typings/origin";

export default class TicketManager {
    constructor(bot: OriginClient) {
        this.create = new CreateTicket(bot);
        this.tickets = new TicketHandler(bot);
        this.panels = new PanelHandler(bot);
    }
    public create: CreateTicket;
    public tickets: TicketHandler;
    public panels: PanelHandler;
}


class CreateTicket  {
    constructor(bot: OriginClient) {
        this.bot = bot
    }
    private bot: OriginClient

    public command(message: OriginMessage): Promise<void> {
        throw new Error('Hello')
    }

    public reaction(reaction: MessageReaction, User: User) {
        throw new Error('Hello')
    }
}

class PanelHandler {
    constructor(bot: OriginClient) {
        this.bot = bot
    }
    private bot: OriginClient;

    public fetch(opt: { guild_id: string, interface_name?: string, interface_id?: string, message_id?: string, create_reaction?: string }): Promise<Panel> {
        return this.bot.handlers.database.getOne(
            'ticketing',
            'interfaces',
            opt
        )
    }
}

class TicketHandler {
	constructor(bot: OriginClient) {
		this.unclaimed = new unClaimedTicketHandler(bot);
		this.ongoing = new OngoingTicketHandler(bot);
	}
	public unclaimed: unClaimedTicketHandler;
	public ongoing: OngoingTicketHandler;
}

export interface TicketCommandCreateData {
    user_name: string,
    user_id: string,
    user_avatar: string;

    title: string;
    description: string;

    channel_id: string;
    menu_id: string;
    [index: string]: string;
}

export interface TicketClaimData {
    support_name: string,
    support_id: string,
    support_avatar: string,

    user_name: string,
    user_id: string,
    user_avatar: string;

    title: string;
    description: string;

    [index: string]: string;
}

interface TicketFetchOptions {
	guild_id: string
	menu_id?: string;
	ticket_id?: string;
	channel_id?: string;
	reaction?: string;
}


class unClaimedTicketHandler {
	constructor(bot: OriginClient) {
        this.bot = bot;
    }
    private bot: OriginClient;


	fetch(opt: TicketFetchOptions): Promise<unClaimedTicket> {
			return this.bot.handlers.database.getOne('ticketing', 'awaiting_claim', opt)
    }

    async delete(guild_id: string, ticket_id: string): Promise<boolean> {
        return this.bot.handlers.database.deleteOne('ticketing', 'awaiting_claim', {
            'guild_id': guild_id,
            'ticket_id': ticket_id
        }) ? true : false
	}
	
	create(guild_id: string, opt: TicketClaimData): Promise<unClaimedTicket> {
		return this.bot.handlers.database.insert('ticketing', 'awaiting_claim', {
			guild_id: guild_id,
			...opt
		})
	}
}

class OngoingTicketHandler {
    constructor(bot: OriginClient) {
        this.bot = bot
    }
	private bot: OriginClient;
	
	public create(guild_id: string, opt: TicketCommandCreateData): Promise<Ticket> {
		return this.bot.handlers.database.insert('ticketing', 'tickets', {
			'guild_id': guild_id,
			...opt
		})
	}

    public fetch(opt: TicketFetchOptions): Promise<Ticket> {
        return this.bot.handlers.database.getOne(
            'ticketing',
            'tickets',
            opt
        )
    }

    public insert(data: TicketCommandCreateData): Promise<Ticket> {
        return this.bot.handlers.database.insert(
            'ticketing',
            'tickets',
            data
        )
    }
    
}