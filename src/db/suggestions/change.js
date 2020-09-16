const { Message, MessageEmbed } = require('discord.js');

const db = require('../../db/');
/**
 *
 * @param { Message } message
 * @param {*} type
 */
exports.change = async function(message, type, num, reason) {
	const item = await db.withSchema('logs').table('suggestion_log')
		.where('guild_id', '=', message.guild.id)
		.where('case', '=', BigInt(num))
		.then(res => {
			if (!res[0]) return false;
			else return res[0];
		});

	if (item === false) return message.channel.send('Suggestion not Found');

	// Get the previous message
	console.log(typeof item.message_id);
	const previous = await message.guild.channels.cache.get(item.channel_id).messages.fetch(item.message_id);
	const previouscontent = previous.embeds[0];

	// Get the color
	const items = [{ name: 'accept', color: '#70ff70', word: 'Accepted' }, { name: 'deny', color: '#ff4938', word: 'Denied' },
		{ name: 'consider', color: '#ffa35c', word: 'Considered' }, { name: 'implement', color: '#6b9aff', word: 'Implemented' }];
	const query = items.find(o => o.name === type);
	const color = query.color;
	const name = query.word;
	// Uppercase name UwU
	// Build and edit new embed
	await build(message, name, color, previous, previouscontent, num, reason);

};
/**
 *
 * @param { Object } obj
 * @param { Message } message
 * @param { MessageEmbed } content
 */
async function build(message, name, color, prev, content, num, reason) {
	const built = new MessageEmbed()
		.setTitle(`Suggestion #${num} ${name}`)
		.setDescription(content.description)
		.setColor(color)
		.setTimestamp()
		.addField(`${name} by ${message.author.username}#${message.author.discriminator}`, (reason) ? reason : 'No Reason Given');
	if (content.author) built.setAuthor(content.author.name, content.author.iconURL);
	await prev.edit(built);
	message.react('739276114542985278');
}