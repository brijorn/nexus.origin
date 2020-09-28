const economy = require('../../models/economy');
const embed = require('../../functions/embed');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, guild, user) => {
	args = args.map(e => e.toLowerCase());
	if (!args[0]) return message.channel.send();
	const amt = (args.find(o => isNaN(o) === false)) ? args.splice(args.indexOf(args.find(o => isNaN(o) === false)), 1).join('') : 1;
	const name = (args.length > 1) ? args.slice(0).join(' ') : args[0];
	const shops = await economy.shop.findOne({ name: 'Shop' });
	const items = shops.data;
	const item = items.find(i => i.name.toLowerCase().includes(name));
	if (!item) return message.channel.send(embed('none', 'Item not found.', guild, 'failure', false, true));
	const price = item.price * amt;
	if (price * amt > user.balance) return message.channel.send(embed('none', item.emoji + ' You\'re too poor to get `' + amt + '` of this item.', guild, '#', false, true));

	await economy.job.userUpd(user, undefined, item, parseInt(amt), parseInt(price), undefined);

	const success = new MessageEmbed()
		.setDescription(`You successfully bought ${amt} ${item.emoji} ${item.name} for ${economy.coin} ${price}`)
		.setFooter('You can view these items in your inventory with "!inv"');
	message.channel.send(success);

};

module.exports.help = {
	name: 'buy',
	aliases: ['purchase'],
	description: 'Purchase an Item from the economy store.',
	module: 'economy',
};