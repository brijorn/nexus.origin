const { Message, Client } = require('discord.js');
const embed = require('../../functions/embed');
const change = require('../../db/suggestions/change');
/**
 *
 * @param { Client } bot
 * @param { Message } message
 * @param {*} args
 * @param {*} guild
 */
module.exports.run = async (bot, message, args, guild) => {
	// Errors
	if (!message.member.hasPermission('MANAGE_GUILD')) {
		return message.channel.send(embed('none', `
    You require the \`MANAGE_SERVER\` permission for this action.`, guild, 'failure', false, true));
	}
	if (!args[0]) return message.channel.send('Please give the suggestion number');
	if (isNaN(args[1])) return message.channel.send('Not a number.');

	// Note

	const note = (args.length > 2) ? args.slice(2).join(' ') : 'No Reason Given';

	// Edit
	await change.change(message, args[0], args[1], note);
	const endTime = Date.now();

};

module.exports.help = {
	name: 'accept',
	aliases: ['implement', 'deny', 'consider'],
	module: 'suggestion',
	syntax: ['!accept [suggestion-number] [note: optional]'],
	description: 'Accept a guild suggestion',
	slice: false,
};