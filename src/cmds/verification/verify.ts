import Discord, { Client, Message } from 'discord.js';
import verify from '../../functions/verifyFunctions/VerifyFunction';
import noblox from 'noblox.js';
import config from '../../config.json';
import roleCheck from '../../functions/verifyFunctions/roleAddCheck';
import prompts from '../../prompt';
import nicknaming from '../../functions/verifyFunctions/nicknaming';
import thumbnail from '../../functions/thumbnailFunction';
import nodefetch from 'node-fetch'
import { VerificationSettings, VerificationUser, GuildSettings } from '@lib/origin';

export async function run(bot: Client, message: Message, args: any[], guild: GuildSettings) {
	// Get the verification table
	const verification = await new VerificationSettings().get(message.guild!.id)
	// Get the Type
	const sendtype = (verification.dm_verification === true) ? await message.author : await message.channel;
	const ask = (verification.dm_verification === true) ? prompts.dmprompt : prompts.prompt;

	await message.react('740748381223256075');
	await(noblox as any).setCookie(process.env.DEFAULT_TOKEN)

	const checkforAccount = await new VerificationUser().get(message.author.id)

	if (checkforAccount) {
		const user = checkforAccount
		const roleAdd = await roleCheck(bot, message, guild, user, verification);
		const newUsername = await noblox.getUsernameFromId(user.primary_account as any);
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

			if (verification.nicknaming === true) {
				const nick = await nicknaming(message, guild, verification, newUsername, roleAdd.roleInfo);
				Verified.setDescription(Verified.description + `\nNickname: \`${nick}\``);
			}
		}
		const avatar = await thumbnail(user.primary_account, '420', 'user');
		Verified.setAuthor(newUsername, avatar, `https://www.roblox.com/users/${user.primary_account}/profile`);
		message.reactions.cache.map(each => each.remove());
		message.react('740751221782085655');
		sendtype.send(Verified);
	}
	if (!checkforAccount) {
		nodefetch(`https://api.blox.link/v1/user/${message.author.id}`, {}).then(async bod => {
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

				// Create the user in the database
				const user = await new VerificationUser().create(message.author.id, body.primaryAccount)

				// Check them for the roles
				const roleAdd = await roleCheck(bot, message, guild, user, verification);
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

					if (verification.nicknaming === true) {
						const nick = await nicknaming(message, guild, verification, newUsername, roleAdd.roleInfo);
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