const embed = require('../../embed');
const config = require('../../../config.json');
const delprompt = require('../../../prompt/delprompt');
const editStartPrompt = require('../../../prompt/editStartPrompt');
const editprompt = require('../../../prompt/editprompt');
const { MessageEmbed } = require('discord.js');
module.exports = async (bot, message, args, guild) => {
	const cancelmsg = '\n\nSay **cancel** at any time to cancel the setup.';
	if (guild.points && guild.points.amount === 2) return message.reply(embed('Max Points Systems Reached', 'You can currently only set **2** Point systems per guild.', guild, config.failure));
	const conmsg = embed('Point Setup', 'You are about to create a new point system for you guild, are you sure?\n\nSay **cancel** at any time to cancel the setup.', guild);
	const con = await delprompt(message, conmsg, 1, 1);
	if (!con.toLowerCase().includes('n')) return;
	const startmsg = embed('Point Setup', 'What is the name of this points system?' + cancelmsg, guild);
	const start = await editStartPrompt(message, startmsg);
	if (start.content.toLowerCase() === 'cancel') return start.message.delete({ timeout: 0 });
	const pointname = start.content;
	const currencymsg = embed('Point Setup', 'What is the name of the currency of this point system?\n\nIf giving an emoji, be sure it is UNICODE.' + cancelmsg, guild);
	const currencyprompt = await editprompt(message, start.message, currencymsg);
	if (currencyprompt.toLowerCase() === 'cancel') return start.message.delete({ timeout: 0 });
	const currency = currencyprompt;
	const end = new MessageEmbed()
		.setTitle('Point System End')
		.setDescription('You are about to create a point system with the following values. Respond `y` or `n` depending if you want to save or cancel.')
		.addField('Name', `**${pointname}**` + `\n*This is what you use when adding points to a user, for example: ${guild.prefix}points ${pointname} add <users> <amount, default: 1>*`)
		.addField('Currency', `**${currency}**` + '\n*This is what the point system would be represented with on the user\'s profile.*');
	const endprompt = await editprompt(message, start.message, end);
	if (!endprompt.toLowerCase().includes('y')) return start.message.delete({ timeout: 0 });
	if (!guild.points) {
		const points = {
			amount: 0,
			enabled: true,
			systems: [],
		};
		guild.points = points;
		await guild.save();
	}
	const newSystem = {
		name: pointname,
		currency: currency,
		users: [],
	};
	guild.points.systems.push(newSystem);
	guild.points.amount = guild.points.amount + 1;
	guild.markModified('points');
	await guild.save();
	start.message.edit(embed('Point System Saved', `Your point system, \`${pointname}\` has sucessfully been saved.`, guild, config.success));

};