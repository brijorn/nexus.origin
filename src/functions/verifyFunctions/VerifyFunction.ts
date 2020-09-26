import { GuildSettings } from "../../typings/origin";

import Discord from 'discord.js';
import rbx from 'noblox.js';
import prompts from '../../lib/util/prompt';
import embed from '../embed';
import roleCheck from '../../functions/verifyFunctions/roleAddCheck';
import config from '../../lib/util/json/config.json';
import OriginClient from "../../lib/OriginClient";
import { VerificationSettings } from "../../handlers/VerificationHandler";
import codeVerification from './codeVerify'
import OriginMessage from "../../lib/extensions/OriginMessage";
export default async (message: OriginMessage, bot: OriginClient, userName: string, guild: GuildSettings, verification: VerificationSettings): Promise<void> => {
	let verifStatus = undefined;
	const sendtype = (verification.dm_verification === true) ? await message.author : await message.channel;
	const prompt = (verification.dm_verification === true) ? prompts.dmprompt : prompts.prompt;
	const id = await rbx.getIdFromUsername(userName);


	const typeask = await prompt(message, embed('Verification', 'Would you like to verify with a `code` or `game`?\n\n`Code` -> Put a code in your roblox status or blurb to verify\n`Game` -> Join a game to verify\n\nRespond **cancel** to cancel.', guild)) as string;
	if (!typeask) return
	if (typeask.toLowerCase() === 'cancel') {sendtype.send('Cancelled.'); return}
	if (typeask.toLowerCase().includes('code')) {
		const code = await codeVerification(bot, message, guild, verification, id, sendtype);
		verifStatus = code;
	}
	/*
	if (typeask.toLowerCase().includes('game')) {
		const codeVerif = require('./gameVerify');
		const info = id.toString();

		const code = await codeVerif(message, info, sendtype, guild);
		verifStatus = code;
	}
	*/
	if (verifStatus === false) return;
	const checkforAccount = await bot.handlers.verification.users.fetch(message.author.id)
	if (!message.member || !message.guild) {message.error('Bot Error: Try running the command again.'); return}
	if (checkforAccount) {
		const user = checkforAccount
		if (user.primary_account !== id) {
			user.primary_account = id
			await user.save()
		}
		const roleAdd = await roleCheck(message.member, message.guild, user, verification);
		const Verified = new Discord.MessageEmbed()
			.setDescription(`You were successfully verified as ${userName}`)
			.setColor(config.success);
		if (roleAdd !== undefined) {
			if (roleAdd.rolesAdded.length > 0) {
				const eachrole = roleAdd.rolesAdded.map((each: string) => `${each}`);
				Verified.addField('Roles Added', eachrole);
			}
			if (roleAdd.rolesRemoved.length > 0) {
				const eachrole = roleAdd.rolesRemoved.map((each: string) => `${each}`);
				Verified.addField('Roles Removed', eachrole);
			}
		}
		sendtype.send(Verified);
	}
	if (!checkforAccount) {
		const user = await bot.handlers.verification.users.create(message.author.id, id);
		const roleAdd = await roleCheck(message.member, message.guild, user, verification);
		const Verified = new Discord.MessageEmbed()
			.setDescription(`You were successfully verified as ${userName}`)
			.setColor(config.success);
		if (roleAdd !== undefined) {
			if (roleAdd.rolesAdded.length > 0) {
				const eachrole = roleAdd.rolesAdded.map((each: string) => `${each}`);
				Verified.addField('Roles Added', eachrole);
			}
			if (roleAdd.rolesRemoved.length !== 0) {
				const eachrole = roleAdd.rolesRemoved.map((each) => `${each}`);
				Verified.addField('Roles Removed', eachrole);
			}
		}
		sendtype.send(Verified);
	}
	message.member?.roles.add(verification.verified_role);


};

