import { Client, Message } from "discord.js";
import GuildSettings from "../../db/guild/types";
import { VerificationSettings } from "../../db/verification/types";
import { CreateUser, GetUser } from "../../db/verification/user/schema";

const Discord = require('discord.js');
const rbx = require('noblox.js');
const prompts = require('../../prompt/')
const embed = require('../embed');
const roleCheck = require('../../functions/verifyFunctions/roleAddCheck');
const config = require('../../config.json');
export default async (message: Message, bot: Client, userName: string, guild: GuildSettings, verification: VerificationSettings) => {
	let verifStatus = undefined;
	const sendtype = (verification.DmVerification === true) ? await message.author : await message.channel;
	const prompt = (verification.DmVerification === true) ? prompts.dmprompt : prompts.regprompt;
	const wait = require('util').promisify(setTimeout);
	const id = await rbx.getIdFromUsername(userName);


	const typeask = await prompt(message, embed('Verification', 'Would you like to verify with a `code` or `game`?\n\n`Code` -> Put a code in your roblox status or blurb to verify\n`Game` -> Join a game to verify\n\nRespond **cancel** to cancel.', guild));
	if (typeask.toLowerCase() === 'cancel') return sendtype.send('Cancelled.');
	if (typeask.toLowerCase().includes('code')) {
		const codeVerif = require('./codeVerify');
		const code = await codeVerif(message, id, sendtype, guild);
		verifStatus = code;
	}
	if (typeask.toLowerCase().includes('game')) {
		const codeVerif = require('./gameVerify');
		const info = id.toString();

		const code = await codeVerif(message, info, sendtype, guild);
		verifStatus = code;
	}
	if (verifStatus = false) return;
	const checkforAccount = await GetUser(message.author.id);


	if (checkforAccount) {
		const verificationUpdate = require('../../models/verificationModel/verificationUpdate');
		const updater = await verificationUpdate(message.author.id, id);
		const user = checkforAccount
		const roleAdd = await roleCheck(bot, message, guild);
		const newUsername = await rbx.getUsernameFromId(user.PrimaryAccount);
		const Verified = new Discord.MessageEmbed()
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
		sendtype.send(Verified);
	}
	if (!checkforAccount) {
		const user = await CreateUser(message.author.id, id)
		const roleAdd = await roleCheck(bot, message, guild);
		const newUsername = await rbx.getUsernameFromId(user.PrimaryAccount);
		const Verified = new Discord.MessageEmbed()
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
		sendtype.send(Verified);
	}
	message.member.roles.add(verification.VerifiedRole);


};

