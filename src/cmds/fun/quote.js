const { MessageEmbed } = require('discord.js');
const Axios = require('axios').default;

module.exports.run = async (bot, message, args, guild) => {

	let data = await Axios.get('https://type.fit/api/quotes');
	data = data.data;
	const quote = data[Math.round(Math.random() * data.length) - 1];
	build(message, quote);
};
function build(message, quote) {
	const built = new MessageEmbed()
		.setDescription(quote.text)
		.setFooter(quote.author);
	message.channel.send(built);
}

module.exports.help = {
	name: 'quote',
	module: 'fun',
	syntax: ['!quote'],
	description: 'Get a random quote',
	cooldown: 3,
};