const embed = require('../../functions/embed');
const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const guildModel = require('../../models/guildModel/guild');
const functions = require('../../db/suggestions/schema');
const logging = require('../../db/suggestions/log');
module.exports.run = async (bot, message, args, guild) => {

	const res = await functions.get(message.guild.id);
	const amount = parseInt(res.amount) + 1;
	if (res.enabled === false || res === false) {return message.reply(embed('none', 'Suggestions are not enabled for this guild.', config.failure));}


	else {
		const content = args.slice(0).join(' ');
		if (content.length <= 5) return message.reply(embed('none', 'Suggestions must be more than 5 words long.', guild, 'failure', true, true));
		const channel = message.client.channels.cache.get(res.channel);
		const suggestion = new MessageEmbed()
			.setTitle(`Suggestion #${amount}`)
			.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL())
			.setDescription(content)
			.setFooter('Nexus Origin')
			.setTimestamp();
		const msg = await channel.send(suggestion);
		try {
			await msg.react(res.FirstReaction);
			await msg.react(res.SecondReaction);
		}
		catch {}
		await logging.add(message, amount, msg);
		await functions.update(message, 'increment', amount);


	}
};

module.exports.help = {
	name: 'suggest',
	module: 'user',
	description: 'Send a suggestion to the guild suggestions chanenl',
	aliases: ['suggestion'],
	syntax: ['!suggest [suggestion]', '!suggest approve [message-id] '],
	inDepth: 'Send a suggestion to the guild suggestions chanenl, requires suggestions to be enabled with a channel',

};