import OriginClient from "../lib/OriginClient";
import { Guild, Role } from "discord.js";
import { VerificationHandler } from "../handlers/VerificationHandler";
import Knex from "knex";
import { DatabaseHandler } from "../handlers/DatabaseHandler";
export class VerificationUser {
	constructor(data: VerificationUser, database: DatabaseHandler) {
		Object.assign(this, data)
		this.database = database
	}
	private database?: DatabaseHandler
	public user_id!: bigint | string;
	public primary_account!: number;
	public roblox_accounts!: number[];

	public save(): Promise<void> {
		const obj = { ...this }
		delete obj.database
		this.database!.save('verification', 'users', { user_id: this.user_id }, obj)
		return Promise.resolve()
	}
}

export class VerificationSettings {
	constructor(data: VerificationSettings, database: DatabaseHandler) {
		Object.assign(this, data)
		this.database = database
	}
	private database?: DatabaseHandler;
	public readonly guild_id!: string;
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
	};
	[key: string]: any;

	public update(field: keyof this, value: any): Promise<VerificationSettings> {
		return this.database!
		.updateOne('modules', 'verification', { guild_id: this.guild_id }, { [field]: value })
		.then((result: any[]) => { return new VerificationSettings(result[0], this.database!) })
	}

	public save(): Promise<void> {
		const obj = { ...this }
		delete obj.database
		this.database!.save('modules', 'verification', { guild_id: this.guild_id }, obj)
		return Promise.resolve()
	}
}

// Interface for all regular asset binds
export interface AssetBindType {
	assetId: number;
	hierarchy: number;
	nickname: string;
	roles: String[] | string[];
}

export interface RankBindType extends AssetBindType {
	rank: number;
}

export interface RoleBindGroup {
	id: number;
	main: Boolean;
	binds: GroupBinds[];
}
export interface GroupBinds {
	id: number;
	hierarchy: number;
	roles: string[];
	nickname: string;
}

export interface NewAssetBindInterface {
	type: "asset" | "gamepass" | "rank";
	method: "add" | "remove" | "edit";
	assetId: number;

	hierarchy: number;
	nickname: string;
	roles: string[];
}

export interface NewRoleBindInterface {
	method: "add" | "remove" | "edit";
	groupId: number;
	hierarchy: number;
	ranks: Role[];
	nickname: string;
    roles: string[];
    flags?: string[];
    editexistingFlags?: string[];
}

export interface TicketInformation {}

export class Panel {
	constructor(data?: Panel) {
		if (data) return Object.assign(this, data);
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
	create_allowed_roles!: String[];
	create_disallowed_roles!: String[];
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
	support_roles!: String[];
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
	claim_allowed_roles!: String[];
}

export class ClaimTicket {
	constructor(data: ClaimTicket, database: DatabaseHandler) {
		Object.assign(this, data)
		this.database = database
	}
	private database: DatabaseHandler
    readonly guild_id!: string;
	readonly ticket_id!: string;
	message_id!: string;
	user_id!: string;
	interface_id!: string;
	reaction!: string;
	ticket_title!: string;
	ticket_description!: string;
	readonly created_timestamp!: string;

	public panel(): Promise<Panel> {
		return this.database
		.getOne('ticketing', 'interfaces', {
			'guild_id': this.guild_id,
			'interface_id': this.interface_id
		})
	}
}


export class Ticket {
	constructor(data: any, database: Knex) {
		if (data) return Object.assign(this, data);
	}
	public database?: Knex
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

	public update(
		guildId: string,
		ticketId: string,
		field: keyof this,
		value: any
	): Promise<Ticket>
	{
		return this.database!
		.withSchema('modules')
		.table('verification')
		.where('guild_id', '=', this.guild_id)
		.first()
		.update({
			[field]: value
		})
		.returning("*")
		.then(result => { return new Ticket(result[0], this.database!) })
	}
}

export class SuggestionSettings {
	constructor(database: DatabaseHandler) {
		this.database = database
	}

	private database: DatabaseHandler;
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

	fetch(guild_id: any): Promise<SuggestionSettings> {
			return this.database.getOne('modules', 'suggestion', {
				'guild_id': guild_id
			})
	}

	increment(amount: number): Promise<SuggestionSettings> {
		return this.database.updateOne('modules', 'suggestion', {
			'guild_id': this.guild_id
		}, { case: amount })
	}
}
/*
class FetchedSuggestion extends SuggestionSettings {
	constructor(data?: any) {
		super();
		if (data) return Object.assign(this, data);
	}

	public async increment(amount?: any, log: LogOpt = { log: false }) {
		const settings = new FetchedSuggestion(
			await db
				.withSchema("modules")
				.table("suggestion")
				.returning("*")
				.where("guild_id", "=", this.guild_id as any)
				.update({
					amount: amount ? amount : parseInt(this.amount as any) + 1,
				})
		);
		return log.log === true
			? await this.log(log.messageId!, log.channelId!, amount)
			: settings;
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
				.table("suggestion")
				.returning("*")
				.where("guild_id", this.guild_id as any)
				.insert({
					case: amount ? amount : parseInt(this.amount as any) + 1,
				})
		);
		return settings;
	}
}
*/
class LogOpt {
	log?: boolean | undefined;
	channelId?: string;
	messageId?: string;
}

export class ApplicationSettings {
	constructor(database: DatabaseHandler, data?: ApplicationSettings) {
		if (data) Object.assign(this, data)
		this.database = database
	}
	private database: DatabaseHandler;
	public readonly guild_id!: string | bigint;
	public enabled!: boolean;
	public applications!: Application[];
	public reviewer_roles!: string[];

	public fetch(where: {}): Promise<ApplicationSettings> {
		return this.database.getOne('modules', 'applications', where)
	}

	public update(where: {}, data: any): Promise<ApplicationSettings> {
		return this.database.updateOne('modules', 'applications', where, data)
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
	constructor(data?: any, bot?: OriginClient) {
		if (data) return Object.assign(this, data);
		if (bot) this.bot = bot
	}
	public readonly bot!: OriginClient;
	public readonly guild_id!: BigInt;
	public prefix!: string;
	public embed!: GuildEmbedSettings;
	public token!: any;

	public fetch(guild_id: string): Promise<GuildSettings> {
		return this.bot.handlers.database.getOne('public', 'guild', {
			guild_id: guild_id
		})
	}

	public create(guildId: string, database: DatabaseHandler): Promise<GuildSettings> {
		const defaultData: {
			guild_id: string;
			prefix: string;
			embed: GuildEmbedSettings;
		} = {
			guild_id: guildId,
			prefix: "!",
			embed: {
				color: "#ab2db3",
				footer: "Nexus Origin",
				footerlogo: "None",
			},
		};
		return database.insert('public', 'guild', defaultData)
	}
}

export interface GuildEmbedSettings {
	color: string;
	footer: string;
	footerlogo: string;
}

export function CreateVerificationSettings(guildId: string, verifiedRole: string, unverifiedRole?: string) {
		return {
			guild_id: guildId,
			enabled: true,
			verified_role: (verifiedRole) ? verifiedRole : null,
			unverified_role: (unverifiedRole) ? verifiedRole : null,
			unverified_enabled: (unverifiedRole) ? unverifiedRole : false,
			autoVerify: false,
			nicknaming: true,
			nickname_format: "{{robloxname}}",
			dm_verification: false,
			role_binds: [],
			rank_binds: [],
			asset_binds: [],
			gamepass_binds: [],
			bypass: {
				bypass_nickname: "",
				update: "",
			}
		}
}


/**
 * 
 * @param guildId Discord Server ID
 * @param opendata JSON Data for the message sent to the ticket channel
 * @param claimdata JSON Data for the message sent to the claim channel
 * @param closedata Message sent to the channel when ticket is closed
 */
export function CreatePanel(guildId: string, opendata: JSON, claimdata: JSON, closedata: JSON): Panel {
	return new Panel({
						guild_id: guildId,
						interface_id: 0n,
						interface_name: "help",
						interface_enabled: true,
						ticket_count: 0n,
						// MISC
						is_public: false,
						claim_system: false,
						// CONFIRMATION
						confirm_close: true,
						confirm_delete: true,
						// TICKET MESSAGE
						ticket_name: "ticket-{{count}}",
						// REACTION MESSAGE
						message_id: 0n,
						remove_on_react: true,
						// MESSAGES
						open_message: opendata,
						close_message: closedata,
						// CATEGORY
						open_category: "Tickets",
						close_category: "Closed Tickets",
						// CREATION SETTINGS
						create_reaction: "📥",
						create_dm_prompt: false,
						create_require_title: true,
						create_require_description: true,
						create_allowed_roles: [guildId],
						create_disallowed_roles: [],
						// COMMAND
						allow_command_create: true,
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
						user_open_permissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
						user_open_disallowed_permissions: [],
						support_open_permissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
						support_open_disallowed_permissions: [],
						// CLOSE
						user_close_permissions: ["VIEW_CHANNEL"],
						user_close_disallowed_permissions: [],
						support_close_permissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
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
						close_reaction: "🔒",
						get_transcript: "📁",
						// CLAIM SYSTEM
						claim_channel: 0n,
						claim_reaction: "💻",
						claim_message: claimdata,
						claim_allowed_roles: [],
					})
		}