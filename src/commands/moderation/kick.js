const errors = require('../../lib/errors');
const embed = require('../../functions/embed');
const { success, checkemoji } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const parse = require('../../lib/parse/index');
module.exports.run = async (bot, message, args, guild) => {
	const error = await errors(message, guild);

	// Permission Handling / Checking
	const moderrors = error.moderation;
	if (!args[0]) {
		const help = bot.cmds.get('kick').help;
		const helpe = new MessageEmbed()
			.setTitle('Kick')
			.setDescription(help.description)
			.addField('Syntax', help.syntax.map(e => `${e}`).join('\n'));
		return message.channel.send(helpe);
	}
	if (error.CheckFor.enabledMod('moderation', 'moderation') === false) return;
	if (moderrors.moderationRoles() === false) return;

	// Get Values
	const user = await parse.member(message, args);
	const reason = (args.length >= 2) ? args.slice(1).join(' ') : 'None';
	message.channel.send(embed('none', `<:check:739276114542985278> **Successfully kicked ${user}(${user.user.username + '#' + user.user.discriminator})**`, guild, success));
	// Dm them before kick
	if (mod.other.dm === true) {
		try {
			const msg = (reason !== 'none') ? ` for ${reason}` : '';
			user.send(embed('Warning', `You have been kicked in **${message.guild.name}** ${msg}`, guild, '#36393E'));
		}
		catch {
			return;
		}
	}
	// Kick the user
	let kicked = true;
	try {
		user.kick(reason);
	}
	catch {
		kicked = false;
		return message.channel.send(embed('Error', 'I could not kick the given user, make sure I have sufficient permissions'));
	}
	if (kicked = false) return;
	// Save and Check if user exists in db
	const mod = guild.moderation;
	const time = new Date();

	// New moderation log Obj
	const kickObj = {
		case: mod.cases + 1,
		date: `${time.getDay()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`,
		user: `${user}(${user.user.username}#${user.user.discriminator})`,
		moderator: `${message.author}(${message.author.username})`,
		reason: reason,
	};
	await moderate.updateUser(guild, user, 'kicks', obj);
	// Log It
	const modlog = (mod.modlog && mod.modlog !== 'none') ? mod.modlog : 'none';
	if (modlog === 'none') {return;}
	else {
		try {
			bot.channels.cache.get(mod.modlog).send(embed(`Kick #${mod.cases}`, `**User:** ${user}(${user.id})\n**Moderator:** ${message.author}${message.author.username}#${message.author.discriminator}\n**Reason:** ${reason}`, guild).setThumbnail(user.user.avatarURL()));
		}
		catch {
			return message.channel.send(embed('Error', 'I could not send a message to the channel specified for moderation logs.', guild, failure));
		}
	}
};

module.exports.help = {
	name: 'kick',
	description: 'Kick a user from your server.',
	syntax: ['!kick <user> <reason>'],
	module: 'moderation',
	cooldown: 3,
};