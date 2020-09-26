
import cheerio from 'cheerio';
import nodefetch from 'node-fetch'
import { Message, MessageEmbed } from 'discord.js';
import Command from "../../lib/structures/Command";
import { GuildSettings } from '../../typings/origin';
import OriginClient from '../../lib/OriginClient';
export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'wyr',
			aliases: ['wouldyourather'],
			description: 'Random WouldYouRather questions'
		});
	}
	async run(message: Message, args: string[], guild: GuildSettings): Promise<Message|void> {
			async function getData() {
				const res = await (await nodefetch('http://either.io/')).json();
				return cheerio.load(res.data);
			}
			const $ = await getData();
			// Red and Blue
			const colors = ['#ff2519', '#1a7beb'];
			const aemojis = ['🅰️', '🇦'];
			const bemojis = ['🅱️', '🇧'];
			const letterA = aemojis[Math.floor(Math.random() * aemojis.length)];
			const letterB = bemojis[Math.floor(Math.random() * bemojis.length)];
			const ques1 = $('div.result.result-1 > .option-text').first().text();
			const ques2 = $('div.result.result-2 > .option-text').first().text();
			const ask = new MessageEmbed()
				.setTitle('Would you Rather')
				.setDescription(`${letterA} ${ques1}\n**OR**\n${letterB} ${ques2}`)
				.setColor(colors[Math.floor(Math.random() * colors.length)])
				.setTimestamp()
				.setFooter(guild.embed.footer, guild.embed.footerlogo);
			return message.channel.send(ask).then(m => {
				m.react(letterA);
				m.react(letterB);
			});
	}
}