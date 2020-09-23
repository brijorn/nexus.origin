import embed from '../../functions/embed';
import config from '../../config.json';
import roleCheck from '../../functions/verifyFunctions/roleAddCheck';
import nicknaming from '../../functions/verifyFunctions/nicknaming';
import noblox from 'noblox.js';
import Discord, { Client, GuildMember, Message } from 'discord.js';
import thumbnail from '../../functions/thumbnailFunction';
import { GuildSettings, VerificationSettings, VerificationUser } from 'typings/origin';
import { member } from '@lib/parse'
export async function run(bot: Client, message: Message, args: string[], guild: GuildSettings) {
	const verification = await new VerificationSettings().get(message.guild!.id)

	let nick = '';
	let mentioned: any;
	if (!message.member!.hasPermission('MANAGE_MESSAGES', { checkAdmin: true, checkOwner: true })) {
		return message.channel.send(embed('Permissions Error', 'You do not have the required permissions for this command.\nRequired Permission: \`MANAGE_MESSAGES` or `ADMIN` OR `OWNER`', guild, config.failure));
	}
	if (message.mentions.users.first()) mentioned = message.guild!.members.cache.get(message.mentions.users.first()!.id) as GuildMember
	else mentioned = await member(message, 
		(args.length > 0) ? args.splice(0).join(' ') : args[0] )
	
		if (!mentioned) return message.channel.send(embed(
		'User Not Found',
		`The given user is not verified.`,
		guild, 'failure', false, true
	))

	const user = (await new VerificationUser().get(mentioned!.id))
	await message.react('740748381223256075');
	const roleAdd = await roleCheck(bot, message, guild, user, verification, 'upd', member);
	console.log(roleAdd);
	const newUsername = await noblox.getUsernameFromId(user.primary_account);
	if (roleAdd!.roleInfo.obj && verification.nicknaming === true) {
		nick = await nicknaming(mentioned, guild, verification, newUsername, roleAdd!.roleInfo, 'upd');
	}
	const Verified = new Discord.MessageEmbed()
		.setDescription(`Member successfully updated as ${newUsername}\n\`Nickname: ${nick}\nCurrent Rank: ${roleAdd!.roleInfo.name} ${(roleAdd!.roleInfo.obj) ? `- ${roleAdd!.roleInfo.obj.rank}` : ''}\``)
		.setTitle(`${mentioned.user!.username}#${mentioned.user!.discriminator} Updated`)
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
	message.channel.send(Verified);

};

module.exports.help = {
	name: 'update',
	module: 'verification',
	description: 'Updates the roles/nickname of the given user',
	cooldown: 15,
};