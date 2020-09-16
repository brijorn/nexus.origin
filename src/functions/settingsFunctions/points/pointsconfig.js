const embed = require('../../embed');
module.exports = async (bot, message, args, guild) => {
	if (args[1] === 'create') {
		const pointscreate = require('./pointscreate');
		return await pointscreate(bot, message, args, guild);
	}
	if (args[1] === 'status') {
		const enabledisable = require('../../enabledisable');
		const msg = await message.channel.send(embed('Toggle', 'Points Toggle', guild));
		return await enabledisable(bot, message, args, guild, 'points', 'enabled', 'points', msg);
	}
};