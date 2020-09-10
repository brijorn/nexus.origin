const { MessageEmbed } = require('discord.js');

const Axios = require('axios').default;

module.exports.run = async (bot, message, args, guild) => {
	async function getDefinition(word) {
		const data = Axios({
			method: 'get',
			url: 'https://owlbot.info/api/v4/dictionary/' + word,
			headers: {
				Authorization: 'TOKEN  acdc6da274dc224f9fa9645d86fbc4e7146e0a96',
			},
		})
			.catch(() => {return message.channel.send('404: Word Not Found');});
		return data;
	}
	if (!args[0]) return message.channel.send('Please give a word to get the definition for');
	const word = (args.length > 1) ? args.splice(0).join('+') : args[0];
	let info = await getDefinition(word);
	info = info.data;
	if (!info || !info.definitions) return;
	let title = info.word;

	if (info.pronunciation !== null) title += ` [${info.pronunciation}]`;
	const definition = new MessageEmbed()
		.setTitle(title)
		.setColor('#ffffff');
	let desc = '';
	for (i = 0; i < info.definitions.length; i++) {
		const def = info.definitions[i];
		desc += `${i + 1}. \`${def.type}\` ${def.definition}`;
		if (def.example) desc += `\n\nExample: ${def.example}`;
		if (def.image_url) definition.setThumbnail(def.image_url);
		if (def.emoji) definition.addField('Emoji', def.emoji);

	}
	definition.setDescription(desc);
	message.channel.send(definition);

};

module.exports.help = {
	name: 'define',
};