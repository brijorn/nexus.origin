import { Guild, GuildMember, Role, TextChannel } from "discord.js";

export default {
	parseChannel,
	parseRole,
	parseMember
}

/**
 * Gets the id out of a string
 * @param value Value to get the ID from
 */
function execute(value: string) {
	const regex = /(?:<@!|<#|<@&|<@)+(\d{17,20})(?:>?)/
	return regex.exec(value)?.pop()
}

/**
 * Returns a GuildChannel or undefined
 * @param guild Guild the channel should belong to
 * @param value Channel name or id
 */
export function parseChannel (guild: Guild, value: string): TextChannel | undefined {
	const victim = execute(value)

	if (victim) return guild.channels.cache.get(victim) as TextChannel
	else return guild.channels.cache.find(channel => channel.name == value) as TextChannel
}

/**
 * Returns a Role or undefined
 * @param guild Guild the role should belong to
 * @param value Role name or Id
 */
export function parseRole (guild: Guild, value: string): Role|undefined {	
	const victim = execute(value)
	
	if (victim) return guild.roles.cache.get(victim)
	else return guild.roles.cache.find(role => role.name == value)
}

/**
 * Returns a GuildMember or undefined
 * @param guild Guild the member should belong to
 * @param value Member name/nickname/id
 */
export function parseMember (guild: Guild, value: string): GuildMember|undefined {
	const victim = execute(value)
	if (victim) return guild.members.cache.get(victim)
	else return guild.members.cache.find(member => member.user.username == value || member.nickname == value)
}