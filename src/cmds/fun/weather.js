const { MessageEmbed } = require('discord.js');
const { default: Axios } = require('axios');

module.exports.run = async (bot, message, args, guild) => {
	if (!args[0]) {
		const help = bot.cmds.get('weather').help;
		const helpe = new MessageEmbed()
			.setTitle('Weather')
			.setDescription(help.description + `\n\n\`${help.aliases.map(e => `${e}`).join(', ')}\``)
			.addField('Syntax', help.syntax);
		message.channel.send(helpe);
	}
	const input = (args.length > 1) ? args.slice(0).join('+') : args[0];
	// format=%c %l:%w:%t\n%f:%p\nChance: %o
	let data = await Axios.get('https://wttr.in/' + input + '?format=%c %l:%w:%t:%f:%p:%h:%S:%s');
	data = data.data;
	data = data.split(':');
	const sunrise = data.splice(6, 2).join(':');
	data.splice(6, 1);
	const sunset = data.splice(6, 2).join(':');
	data.splice(6, 1);
	let title = data[0];
	title = title.replace('+', ' ');
	const weather = new MessageEmbed()
		.setTitle(title)
		.addField('Temperature', `${data[2]}\nFeels Like ${data[3]}`, true)
		.addField('Wind', data[1], true)
		.addField('Percipitation', data[4], true)
		.addField('Humidity', data[5], true)
		.addField('Sunrise', sunrise + ' am', true)
		.addField('Sunset', sunset + ' pm', true);

	message.channel.send(weather);

};

module.exports.help = {
	name: 'weather',
	aliases: ['forecast'],
	description: 'See the weather in you\'re area. If your location is not a town or a city, start it with ~',
	syntax: ['!weather New York', '!weather ~Kilimanjaro'],
};