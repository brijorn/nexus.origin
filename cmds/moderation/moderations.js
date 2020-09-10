const embed = require('../../functions/embed');
const errors = require('../../lib/errors');
const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone');
module.exports.run = async (bot, message, args, guild) => {
	const mod = guild.moderation;
	const error = await errors(message, guild);
	// Getting User and checking if a time is given
	if (error.CheckFor.enabledMod('moderation', 'moderation') === false) return;
	if (error.moderation.moderationRoles() === false) return;

	if (mod.ongoing.length < 1) return message.channel.send(embed('none', 'There are no ongoing moderations.', guild, 'def', false, true));
	const data = await getData(guild.moderation.ongoing);

	const paginate = require('../../lib/forEachPagination');
	return await paginate(bot, message, args, guild, data, true);


};

module.exports.help = {
	name: 'moderations',
};

async function getData(ongoing) {
	const data = ['filler'];
	let j = 0;
	let u = 0;

	for (i = 0; i < ongoing.length; i++) {
		if (j < 5) {
			data[i + 1] = new MessageEmbed();
			let desc = 'If available, use the arrows to see more ongoing moderations.';
			for (;u < ongoing.length && j < 5; u++) {
				const which = ongoing[u];
				j++;
				desc += `\n**Case ${which.case}**\n${which.type} | Moderator: ${which.moderator}\nUntil: ${moment().to(which.until, true)}`;
			}
			if (j === 5) {
				j = 0;
			}
			data[i + 1].setDescription(desc);
			i++;
		}
	}
	return data;
}