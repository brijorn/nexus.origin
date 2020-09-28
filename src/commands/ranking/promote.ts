import embed from '../../functions/embed';
import { getIdFromUsername, promote, getUsernameFromId } from 'noblox.js';
import { Message, MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import OriginMessage from '../../lib/extensions/OriginMessage';
import OriginClient from '../../lib/OriginClient';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'promote',
			description: 'Increment the user\'s rank in the linked group up by 1.',
			cooldown: 10,
			aliases: ['dem'],
			syntax: ['!prompt <roblox-usernames or roblox-userids>'],
			inDepthDescription: `This moves the user's rank up by 1 in the linked group. This requires a roblox token of an account higher than the rank you want to give along with ranking perms in the group.`,
		})
	}

	async run(message: OriginMessage, args: string[]): Promise<Message> {
		const numbers = new RegExp('^[0-9]+$');
		let users: string[] = [];
		const finished = [];
		const verification = this.bot.handlers.verification.settings.fetch(message.guild?.id as string)
		const robloxGroup = (await verification).role_binds.find(group => group.main == true)
		if (!robloxGroup) return message.error('Verification is not set up for this guild or there is no main role bind group.')
		if (users.length === 1 && !args[0].includes(',')) {users.push(args[0]);}
		else {
			const sliceArgs = args.slice(0).join(' ');
			users = sliceArgs.split(',');
			users = users.filter(v=>v != '');
		}
		if (users.length > 1) {
			for (let i = 0;i !== users.length; i++) {
				if (numbers.test(users[i]) === false) {
					const id = await getIdFromUsername(users[i])
						.catch(() => {return message.channel.send('Could not find the user' + users[i]);});
					users.push();
				}
			}
			users.forEach(e => {
				if(isNaN(e as unknown as number)) {
					const index = users.indexOf(e);
					users.splice(index, 1);
				}
			});
			users = users.slice(1);
		}
		else {
			(users[0] as unknown) = (isNaN(users[0] as unknown as number)) ? await getIdFromUsername(users[0]) : users[0];
		}
		for (let i=0;i < users.length; i++) {
			const grp = robloxGroup;
			const demo = await promote(grp.id, users[i] as unknown as number);
			const userObj = {
				name: await getUsernameFromId(users[i] as unknown as number),
				roles: demo,
			};
			finished.push(userObj);
		}
		const finishedmap = finished.map(o => {
			return `\`${o.name}\` - **New Rank:** ${o.roles.newRole.name} ${o.roles.newRole.rank} | **Old Rank:** ${o.roles.oldRole.name} ${o.roles.oldRole.rank}`;
		}).join('\n');
		const finishedembed = new MessageEmbed()
			.setTitle('Promotion Successful')
			.setDescription(`Given users have successfully been promoted:\n${finishedmap}`);
		return message.channel.send(finishedembed);
	}
}