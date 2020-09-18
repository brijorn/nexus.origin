const embed = require('../functions/embed');
const { MessageEmbed } = require('discord.js');
const { enabled, disabled } = require('../config.json');
module.exports = async (bot, message, args, guild, data, timeout = true) => {
	const pages = data;
	let page = 1;
	const maxpage = pages.length - 1;
	pages[1].setFooter(`Page ${page} / ${maxpage}`);
	const mainpage = await message.channel.send(pages[1]);

	if (pages.length > 2) {
		mainpage.react('⬅️');
		mainpage.react('➡️');
	}
	const filter = (reaction, user) => {
		return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
	};

	const collector = mainpage.createReactionCollector(filter, { time: 60000 });
	collector.on('collect', async (reaction, user) => {
		reaction.users.remove(message.author.id);
		if (reaction.emoji.name === '➡️') {
			if (!pages[page + 1]) return;
			page = page + 1;
			pages[page].setFooter(`Page ${page} / ${maxpage}`);
			mainpage.edit(pages[page]);
		}
		if (reaction.emoji.name === '⬅️') {
			if (page - 1 < 1) return;
			page = page - 1;
			pages[page].setFooter(`Page ${page} / ${maxpage}`);
			mainpage.edit(pages[page]);
		}
	});
	collector.on('end', async collected => {
		await mainpage.reactions.cache.map(each => each.remove());
		if (timeout === true) {
			mainpage.edit(embed('Timeout', 'Points has timed out.', guild));
		}
	});
};