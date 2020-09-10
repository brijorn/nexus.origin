const Axios = require('axios').default;
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, guild) => {
	async function getData() {
		const res = await Axios.get('http://either.io/');
		return cheerio.load(res.data);
	}
	const $ = await getData();
	console.log(guild);
	// Red and Blue
	const colors = ['#ff2519', '#1a7beb'];
	const aemojis = ['🅰️', '🇦'];
	const bemojis = ['🅱️', '🇧'];
	const lettera = aemojis[Math.floor(Math.random() * aemojis.length)];
	const letterb = bemojis[Math.floor(Math.random() * bemojis.length)];
	const ques1 = $('div.result.result-1 > .option-text').first().text();
	const ques2 = $('div.result.result-2 > .option-text').first().text();
	const ask = new MessageEmbed()
		.setTitle('Would you Rather')
		.setDescription(`${lettera} ${ques1}\n**OR**\n${letterb} ${ques2}`)
		.setColor(colors[Math.floor(Math.random() * colors.length)])
		.setTimestamp()
		.setFooter(guild.embed.footer, guild.embed.footerlogo);
	message.channel.send(ask).then(m => {
		m.react(lettera);
		m.react(letterb);
	});
};

module.exports.help = {
	name: 'wyr',
	aliases: ['wouldyourather'],
	module: 'fun',
	description: 'Get asked  2 random choices',
};