const { MessageEmbed } = require('discord.js');
const economy = require('../../models/economy');

module.exports.run = async (bot, message, args, guild, user) => {
	if (user.inventory.items.length < 1) {
		const empty = [
			'💭 Theres enough room in here to smuggle a family across the border.',
			'💭 I see you are a extreme minimalist.',
			'💭 This is a good sum of your future.',
			'💭 The future depends on what we do in the present. - *Mahatma Gandhi*, go get a job man.',
		];
		const which = empty[Math.floor(Math.random() * empty.length)];
		const emptinv = new MessageEmbed()
			.setDescription(`${which} - Your inventory is empty.`);
		message.channel.send(emptinv);
	}
	if (!args[0] && user.inventory.items.length > 0) {
		const shop = await economy.shop.findOne({ name: 'Shop' });
		const pages = ['filler'];
		let j = 0;
		let u = 0;
		const inv = user.inventory.items;
		for (i = 0;i < inv.length; i++) {
			if (j < 5) {
				pages[i + 1] = new MessageEmbed()
					.setTitle('Shop');
				let desc = 'To see more pages use `inv [page-number]\n`';
				for (;u < inv.length && j < 10; u++) {
					const item = inv[i];
					const data = shop.data.find(i => i.name === item.name);
					j++;
					desc += `\n**${data.emoji} ${data.name}**─${item.amt}`;
				}
				if (j === 5) {
					j = 0;
				}
				pages[i + 1].setDescription(desc);
				i++;
			}
		}
		page = pages[1];
		page.setFooter(`Page ${pages.indexOf(page)} / ${pages.length - 1}`);
		message.channel.send(page);
	}
	if (args[0]) {
		if (isNaN(args[0]) === true) return message.channel.send('Page must be a number.');
		page = pages[1];
		page.setFooter(`Page ${pages.indexOf(page)} / ${pages.length - 1}`);
		message.channel.send(page);
	}
	console.log(user.inventory);
};

module.exports.help = {
	name: 'inv',
	aliases: ['inventory'],
	module: 'economy',
	cooldown: 5,
};