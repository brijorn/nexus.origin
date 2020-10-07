import { Guild, GuildMember, MessageEmbed } from 'discord.js';
import verify from '../../functions/verifyFunctions/VerifyFunction';
import noblox from 'noblox.js';
import config from '../../lib/util/json/config.json';
import roleCheck from '../../functions/verifyFunctions/roleAddCheck';
import nicknaming from '../../functions/verifyFunctions/nicknaming';
import thumbnail from '../../functions/thumbnailFunction';
import nodefetch from 'node-fetch';
import { GuildSettings } from '../../typings/origin';
import OriginClient from '../../lib/OriginClient';
import { OriginMessage } from '../../lib/extensions/OriginMessage';
import Command from '../../lib/structures/Command';
import message from '../../events/message';
import { VerificationSettings } from '../../handlers/VerificationHandler';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'verify',
			description: 'Link your Roblox Account to your Discord',
		});
	}

	async run(
		message: OriginMessage,
		args: string[],
		guild: GuildSettings,
	): Promise<void> {
		if (!message.member || !message.guild) return;
		// Get the verification table
		const verification = await this.bot.handlers.verification.settings.fetch(
			message.guild?.id,
		);
		// Get the Type
		const sendtype =
			verification.dm_verification === true
				? await message.author
				: await message.channel;
		const ask =
			verification.dm_verification === true ? message.dmprompt : message.prompt;

		await message.react('740748381223256075');
		if (process.env.DEFAULT_TOKEN)
			await noblox.setCookie(process.env.DEFAULT_TOKEN);
		else
			throw new Error('NO DEFAULT .ROBLOSECURITY HAS BEEN SET OR IS INVALID');

		const checkforAccount = await this.bot.handlers.verification.users.fetch(
			message.author.id,
		);

		if (checkforAccount) {
			const user = checkforAccount;
			const roleAdd = await roleCheck(
				message.member,
				message.guild,
				user,
				verification,
			);
			const username = await noblox.getUsernameFromId(user.primary_account);

			return await complete(
				message,
				guild,
				verification,
				roleAdd.rolesAdded,
				roleAdd.rolesRemoved,
				roleAdd.errors,
				user.primary_account,
				username,
			);
		}
		if (!checkforAccount) {
			nodefetch(`https://api.blox.link/v1/user/${message.author.id}`, {}).then(
				async (bod) => {
					const body: {
						status: string;
						primaryAccount?: number;
					} = await bod.json();

					if (body.status === 'error' || !body.primaryAccount) {
						const verifQues = new MessageEmbed()
							.setTitle('Verification')
							.setDescription('What is your roblox username?')
							.setColor('#f79a36');
						const res = await ask(verifQues);
						verify(message, this.bot, res, guild, verification);
					} else {
						// Create the user in the database
						const user = await this.bot.handlers.verification.users.create(
							message.author.id,
							body.primaryAccount,
						);

						// Check them for the roles
						const roleAdd = await roleCheck(
							message.member as GuildMember,
							message.guild as Guild,
							user,
							verification,
						);
						const username = await noblox.getUsernameFromId(
							body.primaryAccount,
						);
						return await complete(
							message,
							guild,
							verification,
							roleAdd.rolesAdded,
							roleAdd.rolesRemoved,
							roleAdd.errors,
							user.primary_account,
							username,
						);
					}
				},
			);
		}
	}
}

async function complete(
	message: OriginMessage,
	guild: GuildSettings,
	verification: VerificationSettings,
	rolesAdded: string[],
	rolesRemoved: string[],
	errors: string[],
	userId: number,
	username: string,
) {
	console.log(errors)
	const sendtype =
		verification.dm_verification === true
			? await message.author
			: await message.channel;
	if (rolesAdded.length > 0 || rolesRemoved.length > 0) {
		const avatar = await thumbnail(userId, '420', 'user');
		const verifiedEmbed = new MessageEmbed()
			.setDescription(`You were successfully verified as ${username}`)
			.setColor(
				guild.embed.color !== 'none' ? guild.embed.color : config.logocolor,
			)
			.setAuthor(
				username,
				avatar,
				`https://www.roblox.com/users/${userId}/profile`,
			)
			.setFooter(
				'Note: It may take some time for your rank to update due to the 5 minute cache.',
				guild.embed.footerlogo !== 'none' ? guild.embed.footerlogo : '',
			);

		if (rolesAdded.length > 0)
			verifiedEmbed.addField('Roles Added', rolesAdded.join('\n'), true);
		if (rolesRemoved.length > 0)
			verifiedEmbed.addField('Roles Removed', rolesRemoved.join('\n'), true);

		sendtype.send(
			`Welcome! You have successfully been verified in ${message.guild?.name} as ${username}`,
			verifiedEmbed,
		);
	} else {
		sendtype.send(
			`**Welcome to ${message.guild?.name}, ${username}!** Use the command ${guild.prefix}reverify to change your linked Roblox account.\n*Note that it may take some time for your rank to update due to the 5 minute cache.*`,
		);
	}
	if (errors.length > 0) {
		const errorEmbed = new MessageEmbed()
		.setTitle('Errors')
		.setDescription('The following errors were found while trying to give you roles.\n' + errors.join('\n'))
		sendtype.send(errorEmbed)
	}
	message.react('740751221782085655');
}
