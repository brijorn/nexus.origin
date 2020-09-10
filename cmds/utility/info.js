const pack = require('../../package.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone');
module.exports.run = async (bot, message, args, guild) => {
	let totalSeconds = (bot.uptime / 1000);
	const weeks = (totalSeconds > 604800000) ? Math.floor(totalSeconds / 604800000) : 0;
	totalSeconds %= 604800000;
	const days = Math.floor(totalSeconds / 86400);
	totalSeconds %= 86400;
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds % 60);

	const string = `${weeks} Weeks ${days} Days ${minutes} minutes and ${seconds} seconds`;

	const start = moment(bot.readyAt).tz('America/New_York').format('ddd, MMM Do YYYY hh:mm a');
	const info = new MessageEmbed()
		.setAuthor(bot.user.username, bot.user.avatarURL())
		.addField('Version', pack.version, true)
		.addField('Library', 'discord.js', true)
		.addField('Creator', 'tranqin#0962', true)
		.addField('Users', bot.users.cache.size, true)
		.addField('Servers', bot.guilds.cache.size, true)
		.addField('Shard', bot.shard, true)
		.addField('Invite', '[here](https://discord.com/api/oauth2/authorize?client_id=737721159667286086&permissions=469821520&scope=bot)', true)
		.addField('Support', '[here](https://discord.gg/4Cn5xxp)', true)
		.addField('Top.gg', 'Coming Soon', true)
		.setFooter(`Last Started: ${start} | Uptime: ${string}`);
	message.channel.send(info);
};

module.exports.help = {
	name: 'info',

};