// Awesome Parsing Stuff
const parse = require('../../lib/parse/index');

// Other Stuff
const errors = require('../../lib/errors');
const { success, failure } = require('../../config.json');
const embed = require('../../functions/embed');
const moderate = require('../../lib/moderation');

module.exports.run = async (bot, message, args, guild) => {
	const error = await errors(message, guild);
	const moderrors = error.moderation;
	// Permission Handling / Checking
	if (!args[0]) {
		const help = bot.cmds.get('mute').help;
		const helpe = new MessageEmbed()
			.setTitle('Mute')
			.setDescription(help.description)
			.addField('Syntax', help.syntax.map(e => `${e}`).join('\n'));
		return message.channel.send(helpe);
	}

	if (error.CheckFor.enabledMod('moderation', 'moderation') === false) return;
	if (moderrors.moderationRoles() === false) return;

	// Get values with my amazing parsing technology
	const user = await parse.member(message, args, true);
	if (user === undefined) return message.channel.send('Error', 'Given user not found', guild, failure);
	let time = parse.time(args, args);
	args = time.newarr;
	console.log(args);
	const readable = time.readable;
	time = time.time;
	console.log(time);
	const reason = (args.length >= 2) ? args.slice(1).join(' ') : 'None';
	const banned = true;

	const mod = guild.moderation;

	// Dm them they were a clown and their now muted
	if (mod.other.dm === true && user.bannable === true) {
		try {
			const msg = (reason !== 'none') ? ` for ${reason}` : '';
			await user.send(embed('Banned', `You have been banned in **${message.guild.name}** ${msg}`, guild, '#36393E'));
		}
		catch {
			return;
		}
	}
	let muted = true;
	// Try giving them the mute role
	try {
		await user.roles.add(mod.mutedrole);
	}
	catch {
		muted = false;
		if (!message.guild.roles.cache.get(mod.mutedrole)) return message.channel.send(embed('none', 'I could not find the given mute role.', guild, failure));
		else return message.channel.send(embed('none', 'Failed to mute the user, be sure I have the sufficient permissions.', guild, failure));
	}

	// Return if there was an error
	if (muted === false) return;
	let desc = `**<:check:739276114542985278> Successfully muted ${user}(${user.user.username + '#' + user.user.discriminator})**`;
	if (reason !== 'None') desc = desc + `, for: *${reason}*`;
	if (time !== 0) desc = desc + ` until ${readable} from now`;
	message.channel.send(embed('none', desc, guild, success));
	const date = new Date().toLocaleString();
	const muteObj = {
		case: mod.cases + 1,
		date: date,
		user: `${user}(${user.user.username}#${user.user.discriminator})`,
		moderator: `${message.author}(${message.author.username}#${user.user.discriminator})`,
		reason: reason,
		until: (time > 0) ? time : 'Never',
	};
	await moderate.userUpd.addCase(message, guild, user, 'mute', muteObj, time);
};

module.exports.help = {
	name: 'mute',
	description: 'Mute a member in your guild indefinitely or for a certain amount of time.',
	syntax: ['!mute @tranqin Too Smart', '!mute @tranqin 2d 3h 5m You\'re in timeout'],
	module: 'moderation',
	cooldown: 3,
};