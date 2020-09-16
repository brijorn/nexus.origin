const embed = require('../../embed');

const { editPrompt, editStart } = require('../../../prompt/');
const functions = require('../../../db/welcome/schema');
module.exports = async (bot, message, args, guild, welcome) => {
	const options = ['toggle', 'message', 'channel', 'description', 'embed', 'title'];

	if (args[1] === 'channel') {
		const parse = require('../../../lib/parse').channel
		if (!args[2]) return message.channel.send('Give a channel.')
		const channel = await parse(bot, message, args[2])
		if (!channel.pre) return message.channel.send('Invalid Channel Given.')
		welcome.channel = channel.pre
		return await functions.update(message, welcome)
	}
	if (args[1] === 'message') {
		const welcomeMessage = require('./welcomeMessage');
		return await welcomeMessage(bot, message, args, guild, ques);
	}
	if (args[1] === 'test') {
		const test = require('./welcomeTest');
		return await test(bot, message, guild, args, welcome);
	}
	if (args[1] === 'toggle') {
		functions.toggle(guild, message, welcome, 'messages')

	}
	if (!options.includes(args[1])) return message.channel.send(embed('Invalid Option', `Please try again with one of the following responses:\n\`${options.join(', ')}\``, guild, 'failure', false, false));
};