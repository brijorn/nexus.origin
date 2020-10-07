import { Client, ColorResolvable, EmbedField, Message, MessageEmbed, MessageEmbedFooter, MessageOptions, Role, Structures } from "discord.js";
import CacheHandler from "../handlers/CacheHandler";
import CommandHandler from "../handlers/CommandHandler";
import DatabaseHandler from "../handlers/DatabaseHandler";
import EventHandler from "../handlers/EventHandler";
import JobHandler from "../handlers/JobHandler";
import { VerificationHandler } from "../handlers/VerificationHandler";
import TicketManager from "../plugins/ticketing/TicketManager";

// Interface for all regular asset binds
export interface AssetBindType {
	assetId: number;
	hierarchy: number;
	nickname: string;
	roles: string[] | string[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface RankBindType extends AssetBindType {
	rank: number;
	name: string;
}

export interface RoleBindGroup {
	id: number;
	main: boolean;
	binds: GroupBinds[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}
export interface GroupBinds {
	id: number;
	hierarchy: number;
	roles: string[];
	nickname: string;
	[key: string]: string | number | string[];
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



export interface LogOpt {
	log?: boolean | undefined;
	channelId?: string;
	messageId?: string;
}


export interface GuildSettings {

	readonly guild_id: BigInt;
	prefix: string;
	embed: GuildEmbedSettings;
	token: string;
}

export interface GuildEmbedSettings {
	color: string;
	footer: string;
	footerlogo: string;
}

export interface OriginMessage extends Message {
	guildembed(
		title: string,
		description: string,
		guild: GuildSettings,
		color?: ColorResolvable,
		footer?: boolean | string,
		timestamp?: boolean,
	): Promise<Message>

	embed(
		opt: EmbedFields
	): Promise<Message>

	dmembed(
		opt: EmbedFields
	): Promise<Message>

	success(
		content: string,
		title?: string
	): Promise<Message>

	failure(
		content: string, 
		title?: string
	): Promise<Message>

	error(
		content: string,
		title?: string
	): Promise<Message>

	send(
		content: string | MessageEmbed
	): Promise<Message>

	dm(content: string | MessageEmbed,
	embed?: MessageEmbed,
	options?: MessageOptions): Promise<Message>

	dmprompt(content: string | MessageEmbed,
		embed?: EmbedFields,
		options?: MessageOptions,
		lower?: boolean): Promise<string|undefined>
	
	prompt(content: string | MessageEmbed,
		embed?: EmbedFields,
		options?: MessageOptions,
		lower?: boolean): Promise<string|undefined>
}

export interface EmbedFields {
	title?: string
	description?: string,
	color?: ColorResolvable,
	footer?: MessageEmbedFooter,
	timestamp?: boolean
	author?: {
		name: string,
		icon: string,
	}
	thumbnail?: string
	fields?: EmbedField[]
}

export interface ApplicationSettings {
	readonly guild_id: string | bigint;
	enabled: boolean;
	applications: Application[];
	reviewer_roles: string[];
}

interface Application {
	name: string;
	available: boolean;
	require_verification: boolean;
	questions: string[];
	response_channel: string;
}
/**
 * Guild Verification Settings
 */
export interface VerificationSettings {
	readonly guild_id: string;
	enabled: boolean;
	verified_role: string;
	unverified_role: string;
	unverified_enabled: boolean;
	autoVerify: boolean;
	nicknaming: boolean;
	nickname_format: string;
	dm_verification: boolean;
	role_binds: RoleBindGroup[];
	rank_binds: RankBindType[];
	asset_binds: AssetBindType[];
	gamepass_binds: AssetBindType[];
	bypass: {
		bypass_nickname: string;
		update: string;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

/**
 * Verification User in Database
 */
export interface VerificationUser {
	user_id: string;
	primary_account: number;
	roblox_accounts: number[];
}

/**
 * Origin Bot Instance extends Discord.js Client
 */
export interface OriginClient extends Client {
	commands: CommandHandler
	events: EventHandler
	handlers: OriginHandlers,

	login(token: string): Promise<string>
}

/**
 * Handlers on Origin Bot Instance
 */
export interface OriginHandlers {
    database: DatabaseHandler,
    ticket: TicketManager,
	verification: VerificationHandler,
	cache: CacheHandler,
	job: JobHandler
}
/**
 * A Panel Settings
 */
export interface Panel {
	// Guild
	guild_id: string;
	// Interface Information
	interface_name: string;
	interface_enabled: boolean;
	interface_id: bigint;
	ticket_count: BigInt;
	// MISC
	// MISC
	is_public: boolean;
	claim_system: boolean;
	// CONFIRMATION
	// CONFIRMATION
	confirm_close: boolean;
	confirm_delete: boolean;
	// TICKET MESSAGE
	// TICKET MESSAGE
	ticket_name: string;
	// REACTION MESSAGE
	// REACTION MESSAGE
	message_id: bigint;
	remove_on_react: boolean;
	// MESSAGES
	// MESSAGES
	open_message: JSON;
	close_message: JSON;
	// CATEGORY
	// CATEGORY
	open_category: string;
	close_category: string;
	// CREATION SETTINGS
	// CREATION SETTINGS
	create_reaction: string;
	create_dm_prompt: boolean;
	create_require_title: boolean;
	create_require_description: boolean;
	create_allowed_roles: string[];
	create_disallowed_roles: string[];

	allow_command_create: boolean;
	command_dm_prompt: boolean;
	command_require_title: boolean;
	command_require_description: boolean;

	open_dm_notify: boolean; // Notify the user when the ticket has been claimed?
	close_dm_notify: boolean; // Notify the user when the ticket has been closed
	// SUPPORT
	// SUPPORT
	support_roles: string[];
	// PERMISSIONS
	// OPEN
	user_open_permissions: string[];
	user_open_disallowed_permissions: string[];
	support_open_permissions: string[];
	support_open_disallowed_permissions: string[];
	// CLOSE
	user_close_permissions: string[];
	user_close_disallowed_permissions: string[];
	support_close_permissions: string[];
	support_close_disallowed_permissions: string[];
	// TRANSCRIPT
	// TRANSCRIPT
	transcript: boolean;
	// LOGGING
	log_enabled: boolean;
	log_channel: BigInt;
	log_claim: boolean;
	log_open: boolean;
	log_close: boolean;
	log_delete: boolean;
	log_transcript: boolean;
	log_transcript_create: boolean;
	// REACTIONS
	// REACTIONS
	close_reaction: string;
	get_transcript: string;
	// CLAIM SYSTEM
	claim_channel: BigInt;
	claim_reaction: string;
	claim_message: JSON;
	claim_allowed_roles: string[];
}

/**
 * A Ticket from TicketManager works for both Claim Tickets and Regular Ones
 */
export interface Ticket {
	ticket_id: string,
	guild_id: string,
	interface_id: string,
	status: string,
	user_name: string,
	user_id: string,
	user_avatar: string,

	support_name?: string,
	support_id?: string,
	support_avatar?: string,

	channel_id: string,
	menu_id: string,
	title: string,
	description: string
}

export interface unClaimedTicket {
	ticket_id: string,
	interface_id: string,

	user_name: string,
	user_id: string,

	reaction: string,

	channel_id: string,
	message_id: string,
}

export interface SuggestionSettings {
	guild_id: string,
	enabled: boolean,
	channel: string,
	suggestion_count: string,
	suggestion_cooldown: string,
	first_reaction: string,
	second_reaction: string,
	whitelisted_roles: string[],
	blacklisted_roles: string[],
	admin_roles: string[]
}

export interface UserProfile {
	user_id: string;
	badges: string[];
	description: string;
	primary_group: boolean;
	status: string;
	presence: boolean,
	thumbnail: string;
}

export interface WelcomeSettings {
	enabled: boolean;
	channel: string;
	embed: boolean;
	message: string;
}

// Moderation

export interface ModerationSettings {
	guild_id: string,
    mod_enabled: boolean,
	mod_roles: string[],
	cases: number,

    kick_enabled: boolean,
    kick_roles: string[],
    kick_require_reason: boolean,
	kick_message: string,
	
    ban_enabled: boolean,
    ban_roles: string[],
    ban_require_reason: boolean,
    ban_message: string

	mute_enabled: boolean,
	muted_role: string,
    mute_roles: string[],
    mute_message: string,
	unmute_message: string,
	
    warn_enabled: boolean,
    warn_roles: string[],
    warn_message: string,
    purge_enabled: boolean,
	mod_log: string
	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface ModerationLog {
	guild_id: string,
	case_id: string,
	user_id: string,
	user_tag: string,
	mod_id: string,
	mod_tag: string,
	type: 'ban' | 'kick' | 'mute' | 'warn',
	reason: string,
	duration: string,
	date: string,
	[key: string]: string

}

export interface ModerationCase {
	guild_id: string,
	case_id: number,
	user_id: string,
	user_tag: string,
	mod_id: string,
	mod_tag: string,
	type: 'ban' | 'kick' | 'mute' | 'warn',
	reason: string,
	duration: string,
	date: string,
}