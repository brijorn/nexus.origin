const parse = require('../../lib/parse').channel;
const { Client, Message } = require('discord.js');
/**
 *
 * @param { Client } bot
 * @param { Message } message
 * @param { Array } args
 * @param { Object } guild
 */
module.exports.run = async (bot, message, args, guild) => {
	let json_data = '';
	try {
		json_data = (args.includes('-channel')) ?
			args.splice(0, args.indexOf('-channel')).join(' ')
			:
			args.splice(0).join(' ');
		json_data = JSON.parse(json_data);
	}
	catch {return message.channel.send('Invalid Json Data, for help use the visualizer here: https://leovoel.github.io/embed-visualizer/');}
	let channel = (args.includes('-channel')) ? args.slice(args.indexOf('-channel') + 1).join('') : undefined;

	if (channel) {
		channel = await parse(bot, message, channel);
		bot.channels.cache.get(channel.pre).send({ embed: json_data });
	}
	else {message.channel.send({ embed: json_data });}
};

module.exports.help = {
	name: 'embed',
	syntax: ['!embed <json-data>', '!embed {"title":"Embed Title", "description": "Embed Description"}'],
	example: ['!embed '],
	description: 'Create and send a bot embed using JSON data, [click here for an Embed Visualizer](https://leovoel.github.io/embed-visualizer/)',
};