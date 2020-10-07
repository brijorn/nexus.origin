import embed from '../../functions/embed';
import config from '../../lib/util/json/config.json';
import roleCheck from '../../functions/verifyFunctions/roleAddCheck';
import nicknaming from '../../functions/verifyFunctions/nicknaming';
import noblox from 'noblox.js';
import Discord, { Client, Guild, GuildMember, Message } from 'discord.js';
import thumbnail from '../../functions/thumbnailFunction';
import { GuildSettings } from '../../typings/origin';
import { parseMember } from '../../lib/util/parse'
import OriginClient from '../../lib/OriginClient';
import { OriginMessage } from '../../lib/extensions/OriginMessage';
import Command from '../../lib/structures/Command';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'update',
			description: 'Update a member\'s roles.'
		})
	}
	
	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<Message> {
		if (!message.guild) return message.error('Bot error, try running the command again');
		const verification = await this.bot.handlers.verification.settings.fetch(message.guild?.id as string)

	let nick = '';
	let mentioned: GuildMember;
	if (!message.member?.hasPermission('MANAGE_MESSAGES', { checkAdmin: true, checkOwner: true })) {
		return message.channel.send(embed('Permissions Error', 'You do not have the required permissions for this command.\nRequired Permission: MANAGE_MESSAGES` or `ADMIN` OR `OWNER`', guild, config.failure));
	}
	if (message.mentions.users.first()) mentioned = message.guild?.members.cache.get(message.mentions.users.first()?.id as string) as GuildMember
	else mentioned = await parseMember(message.guild, 
		(args.length > 0) ? args.splice(0).join(' ') : args[0] ) as GuildMember
	if (!mentioned) return message.error('User not Found')
	
		if (!mentioned) return message.channel.send(embed(
		'User Not Found',
		`The given user is not verified.`,
		guild, 'failure', false, true
	))

	const user = await this.bot.handlers.verification.users.fetch(mentioned.id)
	await message.react('740748381223256075');
	const roleAdd = await roleCheck(message.member as GuildMember, message.guild as Guild, user, verification, message);
	console.log(roleAdd);
	const newUsername = await noblox.getUsernameFromId(user.primary_account);
	if (!roleAdd) return message.error('Failure Ranking.')
	if (roleAdd?.roleInfo.obj && verification.nicknaming === true) {
		nick = await nicknaming(mentioned, message.guild as Guild, verification, newUsername, roleAdd.roleInfo, 'upd');
	}
	const Verified = new Discord.MessageEmbed()
		.setDescription(`Member successfully updated as ${newUsername}\n\`Nickname: ${nick}\nCurrent Rank: ${roleAdd.roleInfo.name} ${(roleAdd.roleInfo.obj) ? `- ${roleAdd.roleInfo.obj.rank}` : ''}\``)
		.setTitle(`${mentioned.user?.username}#${mentioned.user.discriminator} Updated`)
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
	}
	const avatar = await thumbnail(user.primary_account, '420', 'user');
	Verified.setAuthor(newUsername, avatar, `https://www.roblox.com/users/${user.primary_account}/profile`);
	message.reactions.cache.map(each => each.remove());
	message.react('740751221782085655');
	return message.channel.send(Verified);
	}
}