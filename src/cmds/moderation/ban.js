const { MessageEmbed } = require('discord.js');
const errors = require('../../lib/errors');
const { success, failure, checkemoji } = require('../../config.json');
const embed = require('../../functions/embed');
const parse = require('../../lib/parse/index');
module.exports.run = async (bot, message, args, guild) => {
	const error = await errors(message, guild);
	const moderrors = error.moderation;
	// Permission Handling / Checking
	if (!args[0]) {
		const help = bot.cmds.get('ban').help;
		const helpe = new MessageEmbed()
			.setTitle('Ban')
			.setDescription(help.inDepth)
			.addField('Syntax', help.syntax.map(e => `${e}`).join('\n'));
		return message.channel.send(helpe);
	}

	// Getting User and checking if a time is given
	if (error.CheckFor.enabledMod('moderation', 'moderation') === false) return;
	if (moderrors.moderationRoles() === false) return;

	// Get values with my amazing parsing technology
	const user = await parse.member(message, args, true);
	if (user === undefined) return message.channel.send('Error', 'Given user not found', guild, failure);
	let time = parse.time(args, args);
	args = time.newarr;
	const readable = time.readable;
	time = time.time;
	const reason = (args.length >= 2) ? args.slice(1).join(' ') : 'None';
	let banned = true;
	// Dm before Ban
	const mod = guild.moderation;
	if (mod.other.dm === true && user.bannable === true) {
		try {
			const msg = (reason !== 'none') ? ` for ${reason}` : '';
			await user.send(embed('Banned', `You have been banned in **${message.guild.name}** ${msg}`, guild, '#36393E'));
		}
		catch {
			return;
		}
	}
	// Ban the User
	try {
		await user.ban();
	}
	catch {
		banned = false;
		if (user.bannable === false) return message.channel.send(embed('none', 'It seems I can\'t ban this user, oh what a shame..', guild, failure));
		else return message.channel.send(embed('none', 'Failed to ban user, be sure I have the sufficient permissions, you can trust me :)', guild, failure));
	}
	if (banned === false) return;
	let desc = `**<:check:739276114542985278> Successfully banned ${user}(${user.user.username + '#' + user.user.discriminator})**`;
	if (reason !== 'None') desc = desc + `, for: *${reason}*`;
	if (time !== 0) desc = desc + ` until ${readable} from now`;
	message.channel.send(embed('none', desc, guild, success));
	const date = new Date().toLocaleString();
	const banObj = {
		case: mod.cases + 1,
		date: date,
		user: `${user}(${user.user.username}#${user.user.discriminator})`,
		moderator: `${message.author}(${message.author.username}#${user.user.discriminator})`,
		reason: reason,
		until: (time > 0) ? time : 'Never',
	};
	await moderate.userUpd.addCase(message, guild, user, 'ban', banObj, time);
	// Log It
	const modlog = (mod.modlog && mod.modlog !== 'none') ? mod.modlog : 'none';
	if (modlog === 'none') {return;}
	else {
		try {
			bot.channels.cache.get(mod.modlog).send(embed(`Ban #${mod.cases}`, `**User:** ${user}(${user.id})\n**Moderator:** ${message.author}${message.author.username}#${message.author.discriminator}\n**Reason:** ${reason}`, guild).setThumbnail(user.user.avatarURL()));
		}
		catch {
			return message.channel.send(embed('Error', 'I could not send a message to the channel specified for moderation logs.', guild, failure));
		}
	}
};


module.exports.help = {
	name: 'ban',
	description: 'Ban a user from your Discord Server',
	inDepth:  'Ban a user from your Discord Server\nTime Formats: `h = hours,d = days,m = minutes`\nLimit: 14 days',
	syntax: ['!ban <user> <time?> <reason>', 'Example: !ban @tranqin Noob', 'Example: !ban @tranqin 5h 4m Temp Noob'],
	module: 'moderation',
	cooldown: 3,
};