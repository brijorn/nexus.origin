const embed = require('../../functions/embed');
const functions = require('../../db/suggestions/schema');
const { Client, Message, MessageEmbed } = require('discord.js');
/**
 *
 * @param { Client } bot
 * @param { Message } message
 * @param {*} args
 */
module.exports = async (bot, message, args, guild) => {
	args = args.map(e => e.toLowerCase());
	const res = await functions.get(message.guild.id);
	if (res === false && args[1] !== 'create') {
		return message.channel.send(embed('none', `There is no suggestions data for this guild, to start using it,
        run the command ${guild.prefix}settings suggestions create.`, guild, true, true));
	}
	if (args[1] === 'create') {
		await functions.enable(message);
		return message.channel.send(embed('none', 'Suggestion data successfully created.', guild, args, true, true));
	}
	if (!args[1]) {
		const channel = (res.channel.length < 1) ? 'None' : `<#${res.channel}>`;
		const sgstInfo = new MessageEmbed()
			.setTitle('Suggestions')
			.setDescription(`Values can be edited with ${guild.prefix}settings suggestions <value>`)
			.addField('Enabled', res.enabled, true)
			.addField('Channel', channel, true)
			.addField('Amount', res.amount, true)
			.addField('FirstReaction', res.FirstReaction, true)
			.addField('SecondReaction', res.SecondReaction);
		return message.channel.send(sgstInfo);
	}
	if (args[1] === 'channel') {
		const parse = require('../../lib/parse');
		if (!args[2]) return message.channel.send('Please give a channel to set suggestions to.');
		const channel = (await parse.channel(bot, message, args[2])).pre;
		functions.update(message, 'channel', channel);
		return message.channel.send(embed('Channel Changed', `Successfully set the suggestions channel to <#${channel}>`, guild, 'success', false, true));
	}
	if (args[1].startsWith('first')) {
		if (!args[2]) return message.channel.send('Please give the emoji or custom emoji Id to be used for the first reaction.');
		functions.update(message, 'FirstReaction', args[2]);
		return message.channel.send(embed('Reaction Changed', 'Successfully changed the first reaction. *If it is not reacted on this message it did not work.*', guild, 'success', false, true))
			.then(msg => {
				try{ msg.react(args[2]); }
				catch { return; }
			});
	}
	if (args[1].startsWith('second')) {
		if (!args[2]) return message.channel.send('Please give the emoji or custom emoji Id to be used for the first reaction.');
		functions.update(message, 'SecondReaction', args[2]);
		return message.channel.send(embed('Reaction Changed', 'Successfully changed the second reaction. *If it is not reacted on this message it did not work.*', guild, 'success', false, true))
			.then(msg => {
				try{ msg.react(args[2]); }
				catch { return; }
			});
	}
};