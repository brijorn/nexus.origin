const shops = require('../../models/economy/item/shop');
const { MessageEmbed } = require('discord.js');
const item = require('../../models/economy/item/shop');
const economy = require('../../models/economy');
module.exports.run = async (bot, message, args, guild) => {

	const itemlist = await shops.findOne({ name: 'Shop' });
	const pages = ['filler'];
	let j = 0;
	let u = 0;

	for (i = 0;i < itemlist.data.length; i++) {
		if (j < 5) {
			pages[i + 1] = new MessageEmbed()
				.setTitle('Shop');
			let desc = 'To see more pages use `shop [page-number]\n`';
			for (;u < itemlist.data.length && j < 5; u++) {
				j++;
				const item = itemlist.data[u];
				desc += `\n**${item.emoji} ${item.name}** ${economy.coin} ${item.price}\n${item.desc}`;
			}
			if (j === 5) {
				j = 0;
			}
			pages[i + 1].setDescription(desc);
			i++;
		}
	}

	if (!args[0]) {
		page = pages[1];
		page.setFooter(`Page ${pages.indexOf(page)} / ${pages.length - 1}`);
		message.channel.send(page);
	}
	if (args[0]) {
		if (isNaN(args[0]) === true) return message.channel.send('The page must be a number');
		if (!pages[args[0]]) return message.channel.send('Page does not exist');
		page = pages[args[0]];
		page.setFooter(`Page ${pages.indexOf(page)} / ${pages.length - 1}`);
		message.channel.send(page);
	}
};

module.exports.help = {
	name: 'shop',
	module: 'economy',
};