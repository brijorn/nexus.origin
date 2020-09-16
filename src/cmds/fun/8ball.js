const Axios = require('axios').default;
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, guild) => {
	if (!args[3]) return message.channel.send('You must ask a question');
	responses = ['It is certain.',
		'It is decidedly so.',
		'Without a doubt.',
		'Yes, definitely.',
		'You may rely on it.',
		'As I see it, yes.',
		'Most likely.',
		'Outlook good.',
		'Yes.',
		'Signs point to yes.',
		'Reply hazy, try again.',
		'Ask again later.',
		'Better not tell you now.',
		'Cannot predict now.',
		'Concentrate and ask again.',
		'Don\'t count on it.',
		'My reply is no.',
		'My sources say no.',
		'Outlook not so good.',
		'Very doubtful.'];
	const answer = responses[Math.floor(Math.random() * responses.length)];
	const res = new MessageEmbed()
		.setTitle('8Ball')
		.setThumbnail('https://i.imgur.com/akdtE4H.gif')
		.setDescription(answer)
		.setTimestamp();

	message.channel.send(res);
};

module.exports.help = {
	name: '8ball',
	aliases: ['8'],
	syntax: ['!8ball [question]'],
	description: 'Asks a would you rather question',
	module: 'fun',
};