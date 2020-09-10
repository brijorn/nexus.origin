const { message } = require('noblox.js');
const level = require('../../models/economy/ecouser//level');
const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, guild, user) => {
	const levelbar = level.levelBar(user.levelling.current, user.levelling.required);
	const stats = new MessageEmbed()
		.setAuthor(`${message.author.username}'s Stats`, message.author.avatarURL())
		.addField('Level', `${user.levelling.level}\n${levelbar}\n${user.levelling.current} Xp`, true)
		.addField('Required XP', user.levelling.required, true)
		.addField('Balance', user.balance, true)
		.addField('Job', user.job.name, true)
		.addField('Commands Used', user.commandsUsed);
	message.channel.send(stats);
};

module.exports.help = {
	name: 'stats',
	description: 'See your economy stats',
	module: 'economy',
};