import { Guild, GuildMember, Message, PermissionResolvable, TextChannel } from 'discord.js';
import { RegularEmbed } from '../../functions/embed';
import CacheHandler from '../../handlers/CacheHandler';
import DatabaseHandler from '../../handlers/DatabaseHandler';
import JobHandler from '../../handlers/JobHandler';
import { OriginMessage } from '../../lib/extensions/OriginMessage';
import {
	EmbedFields,
	GuildSettings,
	ModerationSettings,
	OriginClient,
} from '../../typings/origin';

export function getModerationTime(params: string[]): ModerationTime {
	const argument = params.join(' ');
	const TIME_REGEX = /(?:(?:<@!?)?(\d{17,20})>?(?:\s?(?:(\d+)\s?d(?:ays?)?)?\s?(?:(\d+)\s?h(?:ours?|rs?)?)?\s?(?:(\d+)\s?m(?:inutes?|in)?)?\s?(?:(\d+)s(?:econds?|ec)?)?)?(\s?[^>]*))/i;

	const time = TIME_REGEX.exec(argument);
	time?.shift();
	if (time == null) return { error: 'null' };

	const userId = time.shift();

	if (!userId) return { error: 'missing user' };
	const reason = time.pop() || 'None';

	const int: number[] = [];
	time.forEach((it) => int.push(parseInt(it) || 0));

	let [days, hours, minutes, seconds] = int;

	let readable = '';
	if (days > 0) readable += `${days} ${plural(days, 'day')}`;
	if (hours > 0) readable += `${hours} ${plural(hours, 'hour')} `;
	if (minutes > 0) readable += `${minutes} ${plural(minutes, 'minute')} `;
	if (seconds > 0) readable += `${seconds} ${plural(seconds, 'second')}`;
	if (days == 0 && hours == 0 && minutes == 0 && seconds == 0)
		readable == 'Permanent';

	if (!days && !hours && !minutes && !minutes && !seconds)
		return {
			userId,
			reason,
			readable,
		};

	days = days ? days * 24 * 60 * 60 * 1000 : 0;
	hours = hours ? hours * 60 * 60 * 1000 : 0;
	minutes = minutes ? minutes * 60 * 1000 : 0;
	seconds = seconds ? seconds * 1000 : 0;
	const ms = days + hours + minutes + seconds;
	// 2 Weeks
	if (ms >= 1209600000) return { error: 'exceed limit' };

	return {
		userId,
		reason,
		readable,
		ms,
	};
}

export async function modChecks(
	bot: OriginClient,
	message: OriginMessage,
	perm?: PermissionResolvable
): Promise<ModerationSettings | undefined> {
	const moderation: ModerationSettings = await bot.handlers.database.getOne(
		'modules',
		'moderation',
		{ guild_id: message.guild?.id },
	);

	if (!moderation) {
		message.error('Moderation is not enabled for this guild');
		return;
	}

	if (
		message.member?.roles.cache.some((role) =>
			moderation.mod_roles.includes(role.id),
		) == false
	) {
		message.failure('You do not have permission to run this command');
		return;
	}

	if (perm && bot.user) {
		if (message.guild?.members.cache.get(bot.user.id)?.hasPermission(perm) == false)
			message.failure(`I am missing the permission ${perm} which is required for this command`)
	}
	return moderation
}
// This is absolutely necessary
function plural(time: number, name: string) {
	if (time > 1) return name + 's';
	else return name;
}
interface ModerationTime {
	error?: string;
	userId?: string;
	reason?: string;
	readable?: string;
	ms?: number;
}

interface SuccessfulModeration {
	database: DatabaseHandler;
	jobs: JobHandler;
	cache: CacheHandler;
	message?: OriginMessage;
	guild: GuildSettings;
	moderation: ModerationSettings;
	type: 'ban' | 'kick' | 'mute' | 'warn';
	typeObj?: ModerationTypeOption;
	user: GuildMember;
	moderator: GuildMember;
	time?: number;
	readable?: string;
	reason: string;
}

export async function sucessfulModeration(
	opt: SuccessfulModeration,
): Promise<void> {
	opt.typeObj = MODERATION_TYPES.find((option) => option.name == opt.type);

	if (opt.message) await successfulModerationMessage(opt);
	if (!opt.message?.guild) return;

	const caseCount = ++opt.moderation.cases;

	const typeObj = MODERATION_TYPES.find(type => type.name == opt.type)
	await modLog (opt.moderation, opt.user.guild, {
		author: {
			name: opt.moderator.user.tag,
			icon: opt.moderator.user.avatarURL() || ''
		},
		description: `**${opt.typeObj?.emoji} ${opt.typeObj?.pastProper} ${opt.user.user.tag}** (**ID**: ${opt.user.id})
		📄 **Reason:** ${opt.reason}`,
		color: typeObj?.color,
		thumbnail: opt.user.user.avatarURL({ size: 256, dynamic: true }) || '',
		footer: {
			text: `Case ${caseCount} ${
				opt.readable && opt.readable !== 'Permanent' ? `| Duration: ${opt.readable}` : ''}`
		}
		
	})

	await saveToDatabase(opt, caseCount);

	await updateCaseCount(opt, caseCount);

	if (opt.time && opt.time > 0) await queue(opt);
}

const baseLogEmbed = {
	
}

async function successfulModerationMessage(opt: SuccessfulModeration) {
	const forReason = opt.reason == 'None' ? '' : `for **${opt.reason}**`;
	const untilThen = opt.readable ? `until ${opt.readable} from now` : '';

	await opt.message?.guildembed(
		'none',
		`Sucessfully ${opt.typeObj?.past} ${opt.user} ${forReason} ${untilThen}`,
		opt.guild,
		'success',
		true,
		true,
	);
}

export async function dmUser(
	user: GuildMember,
	type: 'ban' | 'kick' | 'mute' | 'warn',
	reason: string,
	readable?: string,
): Promise<Message | undefined> {
	const forReason = reason == 'None' ? '' : ` for **${reason}**`;
	const untilThen = readable ? ` until ${readable} from now` : '';

	const typeObj = MODERATION_TYPES.find((opt) => opt.name == type);

	try {
		user.send(
			`You have been ${typeObj?.past} in ${user.guild.name}${forReason}${untilThen}`,
		);
	} catch {
		return;
	}
}

export async function modLog (moderation: ModerationSettings, guild: Guild, embed: EmbedFields): Promise<void> {
	const channel = guild.channels.cache.get(
		moderation.mod_log,
	) as TextChannel;
	if (!channel || channel.viewable == false || channel.deleted == true) return;

	await channel.send(RegularEmbed(embed))
}

async function saveToDatabase(opt: SuccessfulModeration, caseCount: number) {
	return opt.database.insert('logs', 'moderation', {
		guild_id: opt.guild.guild_id,
		case_id: caseCount,
		user_id: opt.user.id,
		user_tag: opt.user.user.tag,
		mod_id: opt.moderator.id,
		mod_tag: opt.moderator.user.tag,
		type: opt.type,
		reason: opt.reason,
		duration: opt.time,
		date: Date.now(),
	});
}

async function queue(opt: SuccessfulModeration) {
	if (!opt.time) throw new Error('Missing time');
	const jobId = await opt.jobs.queue({
		name: opt.type,
		data: {
			guild_id: opt.guild.guild_id,
			user_id: opt.user.id,
			log_channel: opt.moderation.mod_log,
			muted_role: opt.type == 'mute' ? opt.moderation.muted_role : '',
		},
		options: {
			startAfter: opt.time / 1000, // Seconds
		},
	});
	if (jobId == null) return;

	opt.cache.set(`${opt.type}:${opt.guild.guild_id}:${opt.user.id}`, jobId)
	return;
}
async function updateCaseCount(opt: SuccessfulModeration, caseCount: number) {
	opt.moderation.cases = caseCount;

	return await opt.database.updateOne(
		'modules',
		'moderation',
		{ guild_id: opt.guild.guild_id },
		opt.moderation,
	);
}

export function DefaultModerationSettings(
	guild_id: string,
): ModerationSettings {
	const data = {
		guild_id: guild_id,
		mod_enabled: true,
		mod_roles: [],
		cases: 0,

		kick_enabled: true,
		kick_roles: [],
		kick_require_reason: false,
		kick_message: DEFAULT_MESSAGES.kick,

		ban_enabled: true,
		ban_roles: [],
		ban_require_reason: false,
		ban_message: DEFAULT_MESSAGES.ban,

		mute_enabled: true,
		muted_role: '',
		mute_roles: [],
		mute_message: DEFAULT_MESSAGES.mute,
		unmute_message: DEFAULT_MESSAGES.unmute,

		warn_enabled: true,
		warn_roles: [],
		warn_message: DEFAULT_MESSAGES.warn,
		purge_enabled: false,
		mod_log: '',
	};
	return data;
}

export async function CreateModerationSettings(
	db: DatabaseHandler,
	guild_id: string,
): Promise<ModerationSettings> {
	return await db.insert(
		'modules',
		'moderation',
		DefaultModerationSettings(guild_id),
	);
}

const DEFAULT_MESSAGES = {
	warn: 'You have been warned in {{guild.name}}\nReason: {{reason}}',
	ban: 'You have been banned from {{guild.name}}\nReason: {{reason}}',
	mute: 'You have been muted in {{guild.name}}\nReason: {{reason}}',
	unmute: 'You have been unmuted in {{guild.name}}\nReason: {{reason}}',
	kick: 'You have been kicked from {{guild.name}}\nReason: {{reason}}',
};

export const MODERATION_TYPES: ModerationTypeOption[] = [
	{
		name: 'warn',
		proper: 'Warn',
		past: 'warned',
		pastProper: 'Warned',
		emoji: '⚠️',
		color: '#f5dd42',
	},
	{
		name: 'ban',
		proper: 'Ban',
		past: 'banned',
		pastProper: 'Banned',
		emoji: '🔨',
		color: '#f72216',
	},
	{
		name: 'kick',
		proper: 'Kick',
		past: 'kicked',
		pastProper: 'Kicked',
		emoji: '👢',
		color: '#ff9945',
	},
	{
		name: 'mute',
		proper: 'Mute',
		past: 'muted',
		pastProper: 'Muted',
		emoji: '🔇',
		color: '#ff9945',
	},
	{
		name: 'unmute',
		proper: 'Unmute',
		past: 'unmuted',
		pastProper: 'Unmuted',
		emoji: '🔊',
		color: '#5079a6'
	}
];

interface ModerationTypeOption {
	name: string;
	proper: string;
	past: string;
	pastProper: string;
	emoji: string;
	color: string;
}
