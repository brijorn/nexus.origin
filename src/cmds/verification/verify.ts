import Discord, { Client, Message } from 'discord.js';
import verify from '../../functions/verifyFunctions/VerifyFunction';
import noblox from 'noblox.js';
import config from '../../config.json';
import roleCheck from '../../functions/verifyFunctions/roleAddCheck';
import prompts from '../../prompt';
import nicknaming from '../../functions/verifyFunctions/nicknaming';
import thumbnail from '../../functions/thumbnailFunction';
import GuildSettings from '../../db/guild/types';
import db from '../../db';
import { VerificationSettings } from '../../db/verification/types';
import { GetUser } from '../../db/verification/user/schema';

export async function run(bot: Client, message: Message, args: any[], guild: GuildSettings) {
	// Get the verification table
	const verification: VerificationSettings = await db.withSchema('modules').table('verification').first()
	// Get the Type
	const sendtype = (verification.DmVerification === true) ? await message.author : await message.channel;
	const ask = (verification.DmVerification === true) ? prompts.dmprompt : prompts.prompt;

	await message.react('740748381223256075');
	await(noblox as any).setCookie(process.env.DEFAULT_TOKEN)

	const checkforAccount = await GetUser(message.author.id);

	if (checkforAccount) {
		const user = checkforAccount
		const roleAdd = await roleCheck(bot, message, guild, verification);
		const newUsername = await noblox.getUsernameFromId(user.PrimaryAccount as any);
		const Verified = new Discord.MessageEmbed()
			.setDescription(`You were successfully verified as ${newUsername}`)
			.setColor(config.success);
		if (roleAdd !== undefined) {
			if (roleAdd.rolesAdded.length !== 0) {
				const eachrole = roleAdd.rolesAdded.map(each => `${each}`);
				Verified.addField('Roles Added', eachrole, true);
			}
			if (roleAdd.rolesRemoved.length !== 0) {
				const eachrole = roleAdd.rolesRemoved.map(each => `${each}`);
				Verified.addField('Roles Removed', eachrole, true);
			}

			if (verification.Nicknaming === true) {
				const nick = await nicknaming(message, guild, newUsername, roleAdd.roleInfo);
				Verified.setDescription(Verified.description + `\nNickname: \`${nick}\``);
			}
		}
		const avatar = await thumbnail(user.PrimaryAccount, '420', 'user');
		Verified.setAuthor(newUsername, avatar, `https://www.roblox.com/users/${user.PrimaryAccount}/profile`);
		message.reactions.cache.map(each => each.remove());
		message.react('740751221782085655');
		sendtype.send(Verified);
	}
	if (!checkforAccount) {
		fetch(`https://api.blox.link/v1/user/${message.author.id}`, {}).then(async bod => {
			const body = await bod.json();

			if (body.status === 'error') {
				const verifQues = new Discord.MessageEmbed()
					.setTitle('Verification')
					.setDescription('What is your roblox username?')
					.setColor('#f79a36');
				const res = await ask(message, verifQues) as any;
				verify(message, bot, res, guild, verification);
			}
			else {

				const verificationcreate = require('../../models/verificationModel/verificationCreate');
				await verificationcreate(message.author.id, body.primaryAccount);
				const roleAdd = await roleCheck(bot, message, guild, verification);
				const newUsername = await noblox.getUsernameFromId(body.primaryAccount);
				const Verified = new Discord.MessageEmbed()
					.setDescription(`You were successfully verified as ${newUsername}`)
					.setColor(config.success);
				if (roleAdd !== undefined) {
					if (roleAdd.rolesAdded.length !== 0) {
						const eachrole = roleAdd.rolesAdded.map(each => `${each}`);
						Verified.addField('Roles Added', eachrole, true);
					}
					if (roleAdd.rolesRemoved.length !== 0) {
						const eachrole = roleAdd.rolesRemoved.map(each => `${each}`);
						Verified.addField('Roles Removed', eachrole, true);
					}

					if (verification.Nicknaming === true) {
						const nick = await nicknaming(message, guild, newUsername, roleAdd.roleInfo);
						Verified.setDescription(Verified.description + `\nNickname: \`${nick}\``);
					}
				}
				const avatar = await thumbnail(body.primaryAccount, '420', 'user');
				Verified.setAuthor(newUsername, avatar, `https://www.roblox.com/users/${body.primaryAccount}/profile`);
				message.reactions.cache.map(each => each.remove());
				message.react('740751221782085655');
				sendtype.send(Verified);


			}


		});
	}

};

module.exports.help = {
	name: 'verify',
	module: 'verification',
	description: 'Link your roblox account to your discord account.',
	cooldown: 5,
};