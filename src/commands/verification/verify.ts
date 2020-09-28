import { Guild, GuildMember, MessageEmbed } from 'discord.js';
import verify from '../../functions/verifyFunctions/VerifyFunction';
import noblox from 'noblox.js';
import config from '../../lib/util/json/config.json';
import roleCheck from '../../functions/verifyFunctions/roleAddCheck';
import nicknaming from '../../functions/verifyFunctions/nicknaming';
import thumbnail from '../../functions/thumbnailFunction';
import nodefetch from 'node-fetch'
import { GuildSettings } from '../../typings/origin';
import OriginClient from '../../lib/OriginClient';
import OriginMessage from '../../lib/extensions/OriginMessage';
import Command from '../../lib/structures/Command';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'verify',
			description: 'Link your Roblox Account to your Discord'
		})
	}

	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void> {
		if (!message.member || !message.guild) return;
	// Get the verification table
	const verification = await this.bot.handlers.verification.settings.fetch(message.guild?.id)
	// Get the Type
	const sendtype = (verification.dm_verification === true) ? await message.author : await message.channel;
	const ask = (verification.dm_verification === true) ? message.dmprompt : message.prompt;

	await message.react('740748381223256075');
	if (process.env.DEFAULT_TOKEN) await noblox.setCookie(process.env.DEFAULT_TOKEN)
	else throw new Error('NO DEFAULT .ROBLOSECURITY HAS BEEN SET OR IS INVALID')

	const checkforAccount = await this.bot.handlers.verification.users.fetch(message.author.id)

	if (checkforAccount) {
		const user = checkforAccount
		const roleAdd = await roleCheck(message.member, message.guild, user, verification);
		const newUsername = await noblox.getUsernameFromId(user.primary_account);
		const Verified = new MessageEmbed()
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
				const nick = await nicknaming(message.member, message.guild, verification, newUsername, roleAdd.roleInfo);
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
			const body: { status: string, primaryAccount?: number } = await bod.json();

			if (body.status === 'error' || !body.primaryAccount) {
				const verifQues = new MessageEmbed()
					.setTitle('Verification')
					.setDescription('What is your roblox username?')
					.setColor('#f79a36');
				const res = await ask(verifQues);
				verify(message, this.bot, res, guild, verification);
			}
			else {
				// Create the user in the database
				const user = await this.bot.handlers.verification.users.create(message.author.id, body.primaryAccount)

				// Check them for the roles
				const roleAdd = await roleCheck(message.member as GuildMember, message.guild as Guild, user, verification);
				const newUsername = await noblox.getUsernameFromId(body.primaryAccount);

				const Verified = new MessageEmbed()
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
						const nick = await nicknaming(message.member as GuildMember, message.guild as Guild, verification, newUsername, roleAdd.roleInfo);
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
	}
}