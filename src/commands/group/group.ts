import Command from "../../lib/structures/Command";
import lookup from '../../lib/util/lookupFunction';
import thumbnail from '../../functions/thumbnailFunction';
import { MessageEmbed } from 'discord.js';
import OriginClient from "../../lib/OriginClient";
import OriginMessage from "../../lib/extensions/OriginMessage";
import fetch from 'node-fetch';
import paginate from '../../lib/util/forEachPagination';
import { getGroup } from "noblox.js";
import { GroupBinds } from "../../typings/origin";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'group',
			description: 'View the information on your main group bind.',
			cooldown: 30,
		})
	}
	async run(message: OriginMessage, args: string[]): Promise<void> {
		if (!message.guild?.id) {
			message.error('Bot Error, try running the command again.')
			return;
		}
		const verification = await this.bot.handlers.verification.settings.fetch(message.guild?.id)
		const robloxGroup = verification.role_binds.find(group => group.main == true)
		if (!robloxGroup) {
			message.error('Verification is not setup for this guild or there is no main role bind group.')
			return;
		}

		if (!args[0]) {
			const group = await getGroup(robloxGroup.id);
			const groupicon = await thumbnail(robloxGroup.id, 512, 'group');
			const shout = (group.shout === null) ? '' : `\n**Latest Shout:** ${group.shout.body} *from ${group.shout.poster.username}*`;
			const groupinfo = new MessageEmbed()
				.setTitle(group.name)
				.setURL(`https://www.roblox.com/groups/${robloxGroup.id}`)
				.setDescription(group.description + `\n${shout}`)
				.addField('Owner', `[${group.owner.username}](https://www.roblox.com/users/${group.owner.userId}/profile)`, true)
				.addField('MemberCount', group.memberCount, true)
				.addField('Public', group.publicEntryAllowed, true)
				.setThumbnail(groupicon);
	
			message.channel.send(groupinfo);
			return;
		}
		args = args.map(e => e.toLowerCase());
		if (!args[0]) return;
		if (args[0].startsWith('rank')) {
			let ranks = await fetch(`https://groups.roblox.com/v1/groups/${robloxGroup.id}/roles`).then(res => res.json());
			ranks = ranks.roles;
			const data = await getData(robloxGroup.binds);
			return await paginate(this.bot, message, data, false);
		}
	}
}

module.exports.help = {
	name: 'group',
	description: 'Information on the linked Roblox group',
	module: 'group',
	aliases: ['g'],

};

async function getData(ranks: GroupBinds[]) {
	let j = 0;
	let u = 0;
	let i = 0;

	const data: MessageEmbed[] = [];
	for (; u < ranks.length;) {
		if (j < 8) {
			data[i + 1] = new MessageEmbed();
			const desc = 'If available, use the arrows to see more ranks.';
			for (;u < ranks.length && j < 5; u++) {
				const rank = ranks[u];
				j++;
				data[i + 1].addField(`${rank.name}`, `**ID:** ${rank.id}\n**Rank:** ${rank.rank}\n**MemberCount:** ${rank.memberCount}\n`, true);
			}
			if (j === 5) {
				j = 0;
			}
			data[i + 1].setDescription(desc);
			i++;
		}
	}
	return data;
}