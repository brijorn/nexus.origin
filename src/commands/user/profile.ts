
import config from '../../lib/util/json/config.json';
import { Message, MessageEmbed } from 'discord.js';
import Badge from '../../plugins/user/profile/badge';
import Command from '../../lib/structures/Command';
import OriginClient from '../../lib/OriginClient';
import OriginMessage from '../../lib/extensions/OriginMessage';
import { GuildSettings, UserProfile } from '../../typings/origin';
import { getPresences } from 'noblox.js';
export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'profile',
			description: 'View your or another user\'s profile'
		})
	}

	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<Message|void> {
		const user = await this.bot.handlers.verification.users.fetch(message.author.id)
		if (!user) return message.error('You must be verified to run this command.')
		let profile = this.bot.handlers.database.getOne('user', 'profiles', { user_id: message.author.id }) as unknown as UserProfile
		if (!profile) profile = await createProfile(this.bot, message.author.id)
		if (!args[0]) {
			// Get Values
			const badges = Badge(profile.badges);
			let description = `${badges}`;

			// Get and set the presence if enabled
			if (profile.presence && profile.presence === true) {
				description += `\n**Presence**: ${await setPresence(user.primary_account)}`;
			}
			if (profile.status && profile.status !== 'none') {
				description += `\n**Status**: ${profile.status}`;
			}
			// Create the profile embed.
			const profileinfo = new MessageEmbed()
				.setTitle('Origin Profile')
				.setAuthor(`${message.author.username}`, message.author.avatarURL() as string, `https://www.roblox.com/users/${user.primary_account}/profile`)
				.addField('Roblox Account', user.primary_account, true)
				.setColor('#36393E')
				.setFooter(`To configure your profile run ${guild.prefix}profile config.`, guild.embed.footerlogo);
			// Check if they have a profile and they didn't set it to none.
			if (profile.description.toLowerCase() !== 'none'){
				description += `\n${profile.description}`;
			}
			profileinfo.setDescription(description);
			// Check if they set a thumbnail and if it isn't none
			if (profile.thumbnail && profile.thumbnail !== 'none') {
				profileinfo.setThumbnail(profile.thumbnail);
			}
			// Check if the guild has any points sytems and add it to the user's profile
			message.reactions.cache.map(each => each.remove());
			return message.channel.send(profileinfo);
		}
		/*
		if (args[0] === 'config') {
			message.reactions.cache.map(each => each.remove());
			const profileconfig = require('../../functions/profileFunc/profileconfig');
			return await profileconfig(message, args, guild, profile, user);
		}
		else {
			message.react(config.loadingemoji);
			const mentioned = '';
			const getprofile = require('../../functions/profileFunc/getprofile');
			await getprofile(message, args, guild, mentioned);
		}
		*/
	}
}

async function setPresence(robloxAccount: number): Promise<string> {
	const presence = (await getPresences([robloxAccount])).userPresences[0]
	console.log(presence)
	if (presence.gameId) return presence.gameId
	else return 'apple'
}

async function createProfile(bot: OriginClient, user_id: string): Promise<UserProfile> {
	return await bot.handlers.database.insert('user', 'profiles', {
		user_id: user_id,
		badges: ['verified'],
		description: 'none',
		primary_group: false,
		status: 'none',
		presence: false,
		thumbnail: 'none'
	})
}