import { Client, Message } from "discord.js";
import { VerificationSettings, VerificationUser, GuildSettings } from "typings/origin";

import Discord from 'discord.js';
import rbx from 'noblox.js';
import prompts from '../../prompt/';
import embed from '../embed';
import roleCheck from '../../functions/verifyFunctions/roleAddCheck';
import config from '../../config.json';

export default async (message: Message, bot: Client, userName: string, guild: GuildSettings, verification: VerificationSettings) => {
	let verifStatus = undefined;
	const sendtype = (verification.dm_verification === true) ? await message.author : await message.channel;
	const prompt = (verification.dm_verification === true) ? prompts.dmprompt : prompts.prompt;
	const wait = require('util').promisify(setTimeout);
	const id = await rbx.getIdFromUsername(userName);


	const typeask = await prompt(message, embed('Verification', 'Would you like to verify with a `code` or `game`?\n\n`Code` -> Put a code in your roblox status or blurb to verify\n`Game` -> Join a game to verify\n\nRespond **cancel** to cancel.', guild)) as string;
	if (typeask!.toLowerCase() === 'cancel') return sendtype.send('Cancelled.');
	if (typeask!.toLowerCase().includes('code')) {
		const codeVerif = require('./codeVerify');
		const code = await codeVerif(message, id, sendtype, guild);
		verifStatus = code;
	}
	if (typeask!.toLowerCase().includes('game')) {
		const codeVerif = require('./gameVerify');
		const info = id.toString();

		const code = await codeVerif(message, info, sendtype, guild);
		verifStatus = code;
	}
	if (verifStatus = false) return;
	const checkforAccount = await new VerificationUser().get(message.author.id);


	if (checkforAccount) {
		const verificationUpdate = require('../../models/verificationModel/verificationUpdate');
		const updater = await verificationUpdate(message.author.id, id);
		const user = checkforAccount
		const roleAdd = await roleCheck(bot, message, guild, user, verification);
		const newUsername = await rbx.getUsernameFromId(user.primary_account);
		const Verified = new Discord.MessageEmbed()
			.setDescription(`You were successfully verified as ${newUsername}`)
			.setColor(config.success);
		if (roleAdd !== undefined) {
			if (roleAdd.rolesAdded.length !== 0) {
				const eachrole = roleAdd.rolesAdded.map((each: any) => `${each}`);
				Verified.addField('Roles Added', eachrole);
			}
			if (roleAdd.rolesRemoved.length !== 0) {
				const eachrole = roleAdd.rolesRemoved.map((each: any) => `${each}`);
				Verified.addField('Roles Removed', eachrole);
			}
		}
		sendtype.send(Verified);
	}
	if (!checkforAccount) {
		const user = await new VerificationUser().create(message.author.id, id)
		const roleAdd = await roleCheck(bot, message, guild, user, verification);
		const newUsername = await rbx.getUsernameFromId(user.primary_account);
		const Verified = new Discord.MessageEmbed()
			.setDescription(`You were successfully verified as ${newUsername}`)
			.setColor(config.success);
		if (roleAdd !== undefined) {
			if (roleAdd.rolesAdded.length !== 0) {
				const eachrole = roleAdd.rolesAdded.map((each: any) => `${each}`);
				Verified.addField('Roles Added', eachrole);
			}
			if (roleAdd.rolesRemoved.length !== 0) {
				const eachrole = roleAdd.rolesRemoved.map((each: any) => `${each}`);
				Verified.addField('Roles Removed', eachrole);
			}
		}
		sendtype.send(Verified);
	}
	message.member!.roles.add(verification.verified_role);


};

