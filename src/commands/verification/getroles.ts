import { Message, MessageEmbed } from "discord.js";

import roleCheck from '../../functions/verifyFunctions/roleAddCheck';
import { getUsernameFromId } from 'noblox.js';
import config from '../../lib/util/json/config.json';
import  { GuildSettings } from "../../typings/origin";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";
import OriginMessage from "../../lib/extensions/OriginMessage";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'getroles',
			description: 'Get your current rank in the main group of the server'
		})
	}

	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void|Message> {
		// Get Verification Setting and Get User Data
	if (!message.guild || !message.member) return;
	const verification = await this.bot.handlers.verification.settings.fetch(message.guild.id)
	if (!verification) return message.channel.send('Verification is not setup for this guild.')
	const checkforAccount = await this.bot.handlers.verification.users.fetch(message.author.id)
	if (checkforAccount) {
		const user = checkforAccount
		const roleAdd = await roleCheck(message.member, message.guild, user, verification);
		const newUsername = await getUsernameFromId(user.primary_account);
		const Verified = new MessageEmbed()
			.setDescription(`You were successfully verified as ${newUsername}`)
			.setColor(config.success);
		if (roleAdd !== undefined) {
			if (roleAdd.rolesAdded.length !== 0) {
				const eachrole = roleAdd.rolesAdded.map(each => `${each}`);
				Verified.addField('Roles Added', eachrole);
			}
			if (roleAdd.rolesRemoved.length !== 0) {
				const eachrole = roleAdd.rolesRemoved.map(each => `${each}`);
				Verified.addField('Roles Removed', eachrole);
			}
		}
		return message.channel.send(Verified);
	}
	if (!checkforAccount) return message.channel.send(`Run the ${guild.prefix}verify command first before doing this.`);
	}
}