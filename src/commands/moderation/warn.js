const parse = require('../../lib/parse');
const errors = require('../../lib/errors');
const embed = require('../../functions/embed');
const { success, failure } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, guild) => {
	const error = await errors(message, guild);

	// Permission Handling / Checking
	const moderrors = error.moderation;
	if (!args[0]) {
		const help = bot.cmds.get('warn').help;
		const helpe = new MessageEmbed()
			.setTitle('Warn')
			.setDescription(help.description)
			.addField('Syntax', help.syntax.map(e => `${e}`).join('\n'));
		return message.channel.send(helpe);
	}
	if (error.CheckFor.enabledMod('moderation', 'moderation') === false) return;
	if (moderrors.moderationRoles() === false) return;
	const user = await parse.member(message, args, false);
	const reason = (args.length >= 2) ? args.slice(1).join(' ') : 'none';
	message.channel.send(embed('none', `<:check:739276114542985278> **Successfully warned ${user}(${user.user.username + '#' + user.user.discriminator})**`, guild, success));

	// Creating user in db if doesn't exist stuff
	const mods = guild.moderation.moderations;
	const mod = guild.moderation;
	const time = new Date().toLocaleString();
	const warnObj = {
		id: user.id,
		type: 'warn',
		case: mod.cases + 1,
		date: time,
		user: `${user}(${user.user.username}#${user.user.discriminator})`,
		moderator: `${message.author}(${message.author.username})`,
		reason: reason,
	};
	await moderate.userUpd.addCase(message, guild, user, 'warn', warnObj);
	if (mod.other.dm === true) {
		try {
			const msg = (reason !== 'none') ? ` for ${reason}` : '';
			user.send(embed('Warning', `You have been warned in **${message.guild.name}** ${msg}`, guild, '#36393E'));
		}
		catch {
			return;
		}
	}
	const modlog = (mod.modlog && mod.modlog !== 'none') ? mod.modlog : 'none';
	if (modlog === 'none') {return;}
	else {
		try {
			bot.channels.cache.get(mod.modlog).send(embed(`Warn #${mod.cases}`, `**User:** ${user}(${user.id})\n**Moderator:** ${message.author}${message.author.username}#${message.author.discriminator}\n**Reason:** ${reason}`, guild).setThumbnail(user.user.avatarURL()));
		}
		catch {
			return message.channel.send(embed('Error', 'I could not send a message to the channel specified for moderation logs.', guild, failure));
		}
	}
};

module.exports.help = {
	name: 'warn',
	description: 'Warns the given member',
	syntax: ['!warn <nickname, username, userId, mention> <reason>'],
	module: 'moderation',
	cooldown: 3,
};