const embed = require('../../functions/embed');
const time = require('../../functions/time');
module.exports.run = async (bot, message, args, guild) => {
	const date = '';
	const info = await time(bot, message, args, guild);
	if (info.name !== undefined) {
		message.channel.send(embed('🕒 Time', `The time in **${info.name}** is ${info.time}`, guild));
	}
};

module.exports.help = {
	name: 'time',
	aliases: ['timezone'],
	module: 'user',
	description: 'See the time in different timezones or set your default time.',
	cooldown: 5,
};