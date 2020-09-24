import OriginClient from "../lib/OriginClient";
import { ClaimTicket, Panel, Ticket } from "../typings/origin";

export default class TicketHandler {
    constructor(bot: OriginClient) {
        this.claim = new ClaimTicketHandler(bot);
        this.ticket = new RegularTicketHandler(bot);
    }
    public claim: ClaimTicketHandler;
    public ticket: RegularTicketHandler;
}

class ClaimTicketHandler {
	constructor(bot: OriginClient) {
        this.bot = bot;
    }
    private bot: OriginClient;


	fetch(guild_id: string, opt: ClaimFetchOptions): Promise<ClaimTicket> {
			return this.bot.handlers.database.getOne('ticketing', 'awaiting_claim', {
                'guild_id': guild_id,
                ...opt
            })
    }

    async delete(guild_id: string, ticket_id: string): Promise<Boolean> {
        return this.bot.handlers.database.deleteOne('ticketing', 'awaiting_claim', {
            'guild_id': guild_id,
            'ticket_id': ticket_id
        }) ? true : false
    }
}

interface ClaimFetchOptions {
    name?: string
    message_id?: string
}

interface FetchOptions {
    ticket_id?: string
}

class RegularTicketHandler {
    constructor(bot: OriginClient) {
        this.bot = bot
    }
    private bot: OriginClient;

    public fetch(guild_id: string, opt: FetchOptions): Promise<ClaimTicket> {
        return this.bot.handlers.database.getOne('ticketing', 'tickets', {
            'guild_id': guild_id,
            ...opt
        })
    }

    public create(guild_id: string, panel: Panel, info: TicketCreationInformation): Promise<Ticket> {
        return this.bot.handlers.database.insert('ticketing', 'tickets', info)
    }
}

export interface TicketCreationInformation {
    ticket_title: string;
    ticket_description: string;
    user_id: string;

    channel_id: string;
    menu_message_id: string;

    ticket_claimer_id?: string;
    ticket_claimer_user?: string;

    claim_timestamp?: number;
	open_timestamp: number;
	close_timestamp?: number;
}