const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, guild, user) => {
	const balance = new MessageEmbed()
		.setTitle('Balance')
		.setDescription(`<:coin:750417588340785293> ${user.balance} coins`);
	if (user.balance < 100) balance.setFooter('Maybe you could file for bankruptcy?');
	if (user.balance > 100) balance.setFooter('Atleast you wont starve?');
	if (user.balance > 10000) balance.setFooter('Foreign Aid Maybe?');
	if (user.balance > 100000) balance.setFooter('You can finally get a girl who likes you');

	message.channel.send(balance);

};

module.exports.help = {
	name: 'bal',
	aliases: ['balance'],
	module: 'economy',
};