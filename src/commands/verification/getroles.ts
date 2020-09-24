import { Message, MessageEmbed } from "discord.js";

import roleCheck from '../../functions/verifyFunctions/roleAddCheck';
import { getUsernameFromId } from 'noblox.js';
import config from '../../lib/util/json/config.json';
import  { GuildSettings } from "../../typings/origin";
import OriginClient from "../../lib/OriginClient";
export async function run(bot: OriginClient, message: Message, args: string[], guild: GuildSettings) {
	// Get Verification Setting and Get User Data
	const verification = await bot.handlers.verification.settings.fetch(message.guild!.id)
	if (!verification) return message.channel.send('Verification is not setup for this guild.')
	const checkforAccount = await bot.handlers.verification.users.fetch(message.author.id)
	if (checkforAccount) {
		const user = checkforAccount
		const roleAdd = await roleCheck(bot, message, guild, user, verification);
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
		message.channel.send(Verified);
	}
	if (!checkforAccount) return message.channel.send(`Run the ${guild.prefix}verify command first before doing this.`);
};

module.exports.help = {
	name: 'getroles',
	module: 'verification',
	description: 'Updates your roles with the linked grouped and binds.',
	cooldown: 3,
};