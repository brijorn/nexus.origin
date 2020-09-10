const thedeed = require('../../lib/errors');
const embed = require('../../functions/embed');
const { getIdFromUsername, promote, getUsernameFromId, setCookie } = require('noblox.js');
const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, guild) => {
	const numbers = new RegExp('^[0-9]+$');
	const errors = await thedeed(message, guild);
	if (errors.CheckFor.robloxtoken === false) return;
	await setCookie(guild.robloxToken);
	let users = [];
	const finished = [];
	if (users.length === 1 && !args[0].includes(',')) {users.push(args[0]);}
	else {
		users = args.slice(0).join();
		users = users.split(',');
		users = users.filter(v=>v != '');
	}
	if (users.length > 1) {
		for (i = 0;i !== users.length; i++) {
			if (numbers.test(users[i]) === false) {
				const id = await getIdFromUsername(users[i])
					.catch(() => {return message.channel.send('Could not find the user' + users[i]);});
				users.push(id);
			}
		}
		users.forEach(e => {
			if(isNaN(e)) {
				const index = users.indexOf(e);
				users.splice(index, 1);
			}
		});
		users = users.slice(1);
	}
	else {
		users[0] = (isNaN(users[0])) ? await getIdFromUsername(users[0]) : users[0];
	}
	for (i = 0;i < users.length; i++) {
		const grp = guild.robloxGroup;
		const promo = await promote(grp, users[i]);
		const userObj = {
			name: await getUsernameFromId(users[i]),
			roles: promo,
		};
		finished.push(userObj);
	}
	const finishedmap = finished.map(o => {
		return `\`${o.name}\` - **New Rank:** ${o.roles.newRole.name} ${o.roles.newRole.rank} | **Old Rank:** ${o.roles.oldRole.name} ${o.roles.oldRole.rank}`;
	}).join('\n');
	const finishedembed = new MessageEmbed()
		.setTitle('Promotion Successful')
		.setDescription(`Given users have successfully been promoted:\n${finishedmap}`);
	message.channel.send(finishedembed);
};

module.exports.help = {
	name: 'promote',
	description: 'Increment the user\'s rank in the linked group up by 1.',
	cooldown: 10,
	module: 'ranking',
	aliases: ['promo'],
	syntax: ['!promote <roblox-usernames or roblox-userids>'],
	inDepth: 'This moves the user\'s rank up by 1 in the linked group. This requires a roblox token of an account higher than the rank you want to give along with ranking perms in the group.',
};