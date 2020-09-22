import { message } from "noblox.js";
import db from "../handlers/DatabaseHandler";

interface VerificationUserInterface {
    user_id: bigint | string;
    primary_account: number;
    roblox_accounts: number[];

}

export class VerificationUser implements VerificationUserInterface {
    constructor() {}
    public readonly user_id!: string;
    public primary_account!: number;
    public roblox_accounts!: number[];

    public async create(userId: string, robloxAccount: number | string) {
        const user: VerificationUser = await db.withSchema('verification').table('users')
        .returning("*")
        .insert({
            user_id: userId,
            primary_account: robloxAccount,
            roblox_accounts: []
        })
        return user
    }
    
    public async get(userId: string) {
        const user: VerificationUser = await db.withSchema('verification').table('users')
        .where('userId', '=', userId)
        .first()
        return user
    }
}

export class VerificationSettings {
    constructor(data?: VerificationSettings) {
        if (data) Object.assign(this, data)
     };

    public readonly guild_id!: bigint | string;
    public enabled!: boolean;
    public verified_role!: string;
    public unverified_role!: string;
    public unverified_enabled!: Boolean;
    public autoVerify!: boolean;
    public nicknaming!: boolean;
    public nickname_format!: string;
    public dm_verification!: boolean;
    public role_binds!: RoleBindGroup[];
    public rank_binds!: RankBindType[];
    public asset_binds!: AssetBindType[];
    public gamepass_binds!: AssetBindType[];
    public bypass!: {
        bypass_nickname: string;
        update: string;
    }

    public async get(guildId: any) {
        const settings = new FetchedVerification(await db.withSchema('modules').table('verification')
        .where('guild_id' as any, '=', guildId)
        .first()
        )
        return settings
    }
    
    public async default(guildId: string | bigint, verifiedRole?: string | bigint, unverified_role?: string | bigint) {
        const settings = new FetchedVerification(await db.withSchema('modules').table('verification')
        .returning("*")
        .insert({
            guild_id: BigInt(guildId),
            enabled: true,
            verified_role: (verifiedRole) ? verifiedRole : null,
            unverified_role: (unverified_role) ? unverified_role : null,
            unVerifiedEnabled: (unverified_role) ? true : false,
            autoVerify: false,
            nicknaming: true,
            nickname_format: '{{robloxname}}',
            dm_verification: false,
            role_binds: [],
            rank_binds: [],
            asset_binds: [],
            gamepass_binds: [],
            bypass: {
                bypass_nickname: '',
                update: ''
            }
        })
        )
    }
}

export class FetchedVerification extends VerificationSettings {
    constructor(data: VerificationSettings) {
        super();
        Object.assign(this, data)
    }

    public async update(setting: (keyof this), value: any) {
        const settings = new VerificationSettings(await db.withSchema('modules').table('verification')
        .returning("*")
        .where('guild_id', '=', this.guild_id as any)
        .first()
        .update({
            [setting]: value
        })
        )
        return settings
    }
}

// Interface for all regular asset binds
export interface AssetBindType {
    assetId: number;
    hierarchy: number;
    nickname: string;
    roles: bigint[] | string[];
}



export interface RankBindType extends AssetBindType { rank: number }


export interface RoleBindGroup {
    id: number;
    main: Boolean;
    binds: GroupBinds[];


}
interface GroupBinds {
    id: number;
    hierarchy: number;
    rank: number;
    roles: bigint[] | string[];
    nickname: string;

}

export interface TicketInformation {
    
}

export class Panel {
    constructor(data?: Panel) {
        if (data) Object.assign(this, data)
    }
	// Guild
	guild_id!: string;
	// Interface Information
	interface_name!: string;
	interface_enabled!: Boolean;
	interface_id!: bigint;
	ticket_count!: BigInt;
	// MISC
	// MISC
    is_public!: Boolean;
	claim_system!: Boolean;
	// CONFIRMATION
	// CONFIRMATION
    confirm_close!: Boolean;
	confirm_delete!: Boolean;
	// TICKET MESSAGE 
	// TICKET MESSAGE 
    ticket_name!: string;
	// REACTION MESSAGE
	// REACTION MESSAGE
    message_id!: bigint;
	remove_on_react!: Boolean;
	// MESSAGES
	// MESSAGES
    open_message!: Object;
	close_message!: Object;
	// CATEGORY
	// CATEGORY
    open_category!: string;
	close_category!: string;
	// CREATION SETTINGS
	// CREATION SETTINGS
    create_reaction!: string;
	create_dm_prompt!: Boolean;
	create_require_title!: Boolean;
	create_require_description!: Boolean;
	create_allowed_roles!: BigInt[];
	create_disallowed_roles!: BigInt[];
	// COMMAND
	// COMMAND
    allow_command_create!: Boolean;
	command_dm_prompt!: Boolean;
	command_require_title!: Boolean;
	command_require_description!: Boolean;
	// DM NOTIFICATIONS
	// DM NOTIFICATIONS
    open_dm_notify!: Boolean;
	close_dm_notify!: Boolean;
	// SUPPORT
	// SUPPORT
    support_roles!: BigInt[];
	// PERMISSIONS
	// OPEN
    user_open_permissions!: string[];
	user_open_disallowed_permissions!: string[];
	support_open_permissions!: string[];
	support_open_disallowed_permissions!: string[];
	// CLOSE
    user_close_permissions!: string[];
	user_close_disallowed_permissions!: string[];
	support_close_permissions!: string[];
	support_close_disallowed_permissions!: string[];
	// TRANSCRIPT
	// TRANSCRIPT
    transcript!: Boolean;
	// LOGGING
    log_enabled!: Boolean;
	log_channel!: BigInt;
	log_claim!: Boolean;
	log_open!: Boolean;
	log_close!: Boolean;
	log_delete!: Boolean;
	log_transcript!: Boolean;
	log_transcript_create!: Boolean;
	// REACTIONS
	// REACTIONS
    close_reaction!: string;
	get_transcript!: string;
	// CLAIM SYSTEM
    claim_channel!: BigInt;
	claim_reaction!: string;
	claim_message!: Object;
    claim_allowed_roles!: BigInt[];
    
    async get(opt: GetQueryOptions) {
        const panel = new FetchedPanel(
            await getTable('interfaces', 'ticketing', opt)
        )
        return panel
    }

    async create(guildId: string, opendata: JSON, closedata: JSON, claimdata: JSON) {
        const panel = new FetchedPanel(
            await db
            .withSchema('ticketing')
            .table('interfaces')
            .returning("*")
            .insert({
                guild_id: guildId,

                interface_name: 'help',
                interface_enabled: true,
                ticket_count: 0n,
                // MISC
                is_public: false,
                claim_system: false,
                // CONFIRMATION
                confirm_close: true,
                confirm_delete: true,
                // TICKET MESSAGE
                ticket_name: 'ticket-{{count}}',
                // REACTION MESSAGE
                message_id: 0n,
                message_reaction: '📩',
                remove_on_react: true,
                // MESSAGES
                open_message: opendata,
                close_message: closedata,
                // CATEGORY
                open_category: 'Tickets',
                close_category: 'Closed Tickets',
                // CREATION SETTINGS
                create_reaction: '📥',
                create_dm_prompt: false,
                create_require_title: true,
                create_require_description: true,
                create_allowed_roles: [guildId],
                create_disallowed_roles:  [],
                  // COMMAND
                allow_command_create:  true,
                command_dm_prompt: true,
                command_require_title: true,
                command_require_description: true,
                // DM NOTIFICATIONS
                open_dm_notify: true,
                close_dm_notify: true,
                // SUPPORT
                support_roles: [],
                // PERMISSIONS
                    // OPEN
                user_open_permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                user_open_disallowed_permissions: [],
                support_open_permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                support_open_disallowed_permissions: [],
                    // CLOSE
                user_close_permissions: ['VIEW_CHANNEL'],
                user_close_disallowed_permissions: [],
                support_close_permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                support_close_disallowed_permissions: [],
                // TRANSCRIPT
                transcript: true,
                // LOGGING
                log_enabled: false,
                log_channel: 0n,
                log_claim: true,
                log_open: true,
                log_close: true,
                log_delete: true,
                log_transcript: true,
                log_transcript_create: true,
                // REACTIONS
                close_reaction: '🔒',
                get_transcript: '📁',
                // CLAIM SYSTEM
                claim_channel: 0n,
                claim_reaction: '💻',
                claim_message: claimdata,
                claim_allowed_roles: []
            })
        )
        return panel
    }
}
export class FetchedPanel extends Panel {
    constructor(data: Panel) {
        super();
        Object.assign(this, data)
    }

    public async update(setting: (keyof this), value: any) {
        return await new FetchedPanel(
            await db
            .withSchema('modules')
            .table('interfaces')
            .where('guild_id', this.guild_id)
            .update({
                [setting]: value
            })
        )
    }
}

export class Ticket {
    constructor(data?: any) {
        if (data) Object.assign(this, data)
    }

    public readonly guild_id!: string;
    public readonly ticket_id!: string;
    public readonly interface_id!: string;

    public status!: string;

    public user_id!: string;

    public channel_id!: string;
    public menu_message_id!: string;

    public ticket_title!: string;
    public ticket_description!: string;

    // Claim Values
    public ticket_claimer_id?: string;
    public ticket_claimer_user?: string;

    // Timestamps
    claim_timestamp?: number;
    open_timestamp!: number;
    close_timestamp?: number;

    public async get(guildId: string, ticketId: string) {
        const ticket = new FetchedTicket(
        await db
        .withSchema('ticketing')
        .table('tickets')
        .where('guild_id', '=', guildId)
        .where('ticket_id', '=', ticketId)
        .first()
        );
        return ticket
    }

    public async create(guildId: string, panel: FetchedPanel, information: any) {
        if (panel.claim_system === true) {
            return new FetchedTicket(
                await db
                .withSchema('ticketing')
                .table('')
            );
        }
        else {
            return new FetchedClaimTicket(
                await db
                .withSchema('ticketing')
                .table('awaiting_claim')
                .insert({
                    guild_id: guildId
    
                })
            )
        }
    }
}

export class FetchedTicket extends Ticket {
    constructor(data: any) {
        super();
        Object.assign(this, data)
    }

    public async update(guildId: string, ticketId: string, setting: (keyof this), value: any) {
        const ticket = new FetchedTicket(
            await db
        .withSchema('ticketing')
        .table('tickets')
        .where('guild_id', '=', guildId)
        .where('ticket_id', '=', ticketId)
        .update({
            [setting]: value
        })
        );
    }

    public async delete(guildId: string, ticketId: string) {
        const ticket = await db
        .withSchema('ticketing')
        .table('tickets')
        .where('guild_id', '=', guildId)
        .where('ticket_id', '=', ticketId)
        .delete()
        .returning("*");

        return ticket;
    }
} 

export class ClaimTicket {
    constructor(data?: any) {
        if (data) Object.assign(this, data);
    }

    public readonly guild_id!: string;
    public readonly ticket_id!: string;

    public readonly message_id!: string;
    public readonly user_id!: string;
    public readonly interface_id!: string;

    public readonly reaction!: string;

    public ticket_title!: string;
    public ticket_description!: string;

    public readonly created_timestamp!: string;

    public async get(guildId: string, ticketId: string) {
        const ticket = new FetchedClaimTicket(
            await db
            .withSchema('ticketing')
            .table('awaiting_claim')
            .where('guild_id', '=', guildId)
            .where('ticket_id', '=', ticketId)
            .first()
        );
        return ticket;
    }
}

export class FetchedClaimTicket extends ClaimTicket {
    constructor(data: any) {
        super();
        Object.assign(this, data);
    }

    public async update(guildId: string, ticketId: string, setting: (keyof this), value: any) {
        const ticket = new FetchedClaimTicket(
            await db
            .withSchema('ticketing')
            .table('awaiting_claim')
            .where('guild_id', '=', guildId)
            .where('ticket_id', '=', ticketId)
            .update({
                [setting]: value
            })
            .returning("*")
        );
        return ticket;
    }

    public async delete(guildId: string, ticketId: string, setting: (keyof this), value: any) {
        const ticket = await db
        .withSchema('ticketing')
        .table('awaiting_claim')
        .where('guild_id', '=', guildId)
        .where('ticket_id', '=', ticketId)
        .delete()
        .returning("*");

        return ticket;
    }
}

export class SuggestionSettings {
	constructor() {}

	public readonly guild_id!: string | bigint;
	public enabled!: boolean;
	public channel!: string;
    public amount!: string;
    public suggestion_cooldown!: number;
	public first_reaction!: string;
	public second_reaction!: string;
	public whitelisted_roles!: string[];
	public blacklisted_roles!: string[];
	public admin_roles!: string[];

	public async get(guildId: any) {
		const settings = new FetchedSuggestion(
			await db
				.withSchema("modules")
				.table("suggestion")
				.where("guild_id", "=", guildId)
				.first()
		);
		return settings;
	}
}

class FetchedSuggestion extends SuggestionSettings {
	constructor(data?: any) {
		super();
		if (data) Object.assign(this, data);
	}

	public async increment(amount?: any, log: LogOpt = { log: false }) {
		const settings = new FetchedSuggestion(
			await db
				.withSchema("modules")
				.table("suggestion")
				.returning("*")
				.where("guild_id", "=", this.guild_id as any)
				.update({
					amount: (amount) ? amount : parseInt(this.amount as any) + 1,
				})
		);
		return (log.log === true) ? await this.log(log.messageId!, log.channelId!, amount) : settings;
	}

	public async update(setting: keyof this, value: any) {
		const settings = new FetchedSuggestion(
			await db
				.withSchema("modules")
				.table("suggestion")
				.returning("*")
				.where("guild_id" as any, "=", this.guild_id as any)
				.first()
				.update({
					[setting]: value,
				})
		);
		return settings;
	}

    public async log(messageId: string, channelId: string, amount?: number) {
		const settings = new FetchedSuggestion(
            await db
            .withSchema("logs")
            .table('suggestion')
            .returning("*")
            .where('guild_id', this.guild_id as any)
            .insert({
                case: (amount) ? amount : parseInt(this.amount as any) + 1
            })
        );
        return settings
	}
}

class LogOpt {

    log?: boolean | undefined;
    channelId?: string;
    messageId?: string;
}

export class ApplicationSettings {
    constructor(data?: ApplicationSettings) {
        if (data) Object.assign(this, data)
    }

    public readonly guild_id!: string | bigint
    public enabled!: boolean;
    public applications!: Application[];
    public reviewer_roles!: string[];

    public async get(opt: GetQueryOptions) {
        const settings = new FetchedApplication(
            await getTable('application', 'modules', opt)
        )
        return settings
    }

}

export class FetchedApplication extends ApplicationSettings {
    constructor(data: ApplicationSettings) {
        super();
        Object.assign(this, data);
    }

    public async update(setting: (keyof this), value: any) {
        const settings = new FetchedApplication(await updateTable('verification', 'modules', this.guild_id as string, {
            type: 'one',
            field: setting,
            data: value 
        })
        )
        return settings
    }
}

interface Application {
    name: string;
    available: boolean;
    require_verification: boolean;
    questions: string[];
    response_channel: string;
    
}

export class GuildSettings {
    constructor(data?: any) { if (data) return Object.assign(this, data); }

    public readonly guild_id!: BigInt;
    public prefix!: string;
    public embed!: GuildEmbedSettings;
    public token!: any;

    async get(opt: GetQueryOptions) {
        const guild: GuildSettings = await getTable('guild', 'public', opt)

        return guild
    }

    async create(guildId: string) {
        const defaultData: {guild_id: string, prefix: string, embed: GuildEmbedSettings} = {
            guild_id: guildId,
            prefix: '!',
            embed: {
                color: '#ab2db3',
                footer: 'Nexus Origin',
                footerlogo: 'None',
            }
        }
        const guild: this = await insertTable('guild', 'public', guildId, defaultData)
    }
}

export interface GuildEmbedSettings {
    color: string,
    footer: string,
    footerlogo: string
}


async function getTable(tableName: string, schema: string, opt: GetQueryOptions) {
    const data = await db
    .withSchema(schema)
    .table(tableName)
    .where(opt.field, '=', opt.value)
    .then(data => {
        if (opt.type === 'all') return data
        else return data[0]
    })
    return data as any
}

interface GetQueryOptions {
    field: string;
    value: string;
    type: 'all' | 'first'
}

interface updateTableData {
    type: 'one' | 'full'
    field?: any,
    data: string,
}
async function updateTable(tableName: string, schema: string, guildId: string, updateData: updateTableData) {
    const data = await db
    .withSchema(schema)
    .table(tableName)
    .where('guild_id', '=', guildId)
    .update( (updateData.type === 'one') ? {
        [updateData.field!]: updateData.data
    }
    :
    updateData
    )
    .returning("*")
    return data as any
}

async function insertTable(tableName: string, schema: string, guildId: string, data: object) {
    if (
        await db
        .withSchema(schema)
        .table(tableName)
        .where('guild_id', '=', guildId)
        .then(res => res.length)
        === 1
    ) return
    else return await db
    .withSchema(schema)
    .table(tableName)
    .where('guild_id', '=', guildId)
    .insert(data) as any
}