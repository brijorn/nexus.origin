import { Client, GuildMember, Message, MessageReaction } from "discord.js";
import { GuildSettings } from "../../typings/origin";
import { OriginMessage } from "../extensions/OriginMessage";

import embed, { RegularEmbed } from '../../functions/embed';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (bot: Client, message: OriginMessage, data: Record<string, any>[], timeout = true): Promise<void> => {
	data.unshift({ type: 'filler'});
	const pages = data
	let page = 1;
	const maxpage = pages.length - 1;
	pages[1].setFooter(`Page ${page} / ${maxpage}`);
	const mainpage = await message.channel.send(pages[1]);

	if (pages.length > 2) {
		mainpage.react('⬅️');
		mainpage.react('➡️');
	}
	const filter = (reaction: MessageReaction, user: GuildMember) => {
		return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
	};

	const collector = mainpage.createReactionCollector(filter, { time: 60000 });
	collector.on('collect', async (reaction, user) => {
		reaction.users.remove(message.author.id);
		if (reaction.emoji.name === '➡️') {
			if (!pages[page + 1]) return;
			page = page + 1;
			pages[page].setFooter(`Page ${page} / ${maxpage}`);
			mainpage.edit(pages[page]);
		}
		if (reaction.emoji.name === '⬅️') {
			if (page - 1 < 1) return;
			page = page - 1;
			pages[page].setFooter(`Page ${page} / ${maxpage}`);
			mainpage.edit(pages[page]);
		}
	});
	collector.on('end', async collected => {
		await mainpage.reactions.cache.map(each => each.remove());
		if (timeout === true) {
			mainpage.edit(RegularEmbed({ title: 'Timeout', description: 'This prompt has timed out.'}));
		}
	});
};