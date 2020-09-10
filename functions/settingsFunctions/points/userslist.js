const embed = require('../../embed');
const { MessageEmbed } = require('discord.js');
const { get } = require('mongoose');
const rbx = require('noblox.js');

module.exports = async (bot, message, args, guild) => {
	const index = args.indexOf(args.find(a => a.startsWith('--')));
	const query = (args.length > 2) ? (index !== -1) ? args.slice(1, index).join(' ').toLowerCase() : args.slice(1).join(' ').toLowerCase() : args[1].toLowerCase();
	if (!guild.points.systems.find(p => p.name.toLowerCase() === query)) return message.channel.send(embed('System Not Found', `Could not find a system with the name \`${args[1]}\``, guild));
	const system = guild.points.systems.find(p => p.name.toLowerCase() === query);
	// Get the system
	console.log(system);
	if (!args.includes('--user')) {
		// Get the users in the system
		let users = system.users;
		users = (args.includes('--asc')) ? users.sort(function(a, b) {
			let comparison = 0;
			if (a.points > b.points) return comparison = 1;
			if (b.points > a.points) return comparison = -1;
		})
			: users;
		users = (args.includes('--des')) ? users.sort(function(a, b) {
			let comparison = 0;
			if (a.points > b.points) return comparison = -1;
			if (b.points > a.points) return comparison = 1;
		})
			: users;

		// Get the pagination function
		const pagination = require('../../useful/forEachPagination');
		const values = ['filler'];
		let j = 0;
		let u = 0;
		let i = 0;
		// Create data
		async function getData() {
			for (; u < users.length;) {
				if (j < 5) {
					values[i + 1] = new MessageEmbed()
						.setTitle(system.name);
					let desc = 'If available, use the arrows to see more users.';
					for (;u < users.length && j < 5; u++) {
						j++;
						const person = users[u];
						const Id = person.userId;
						const username = await rbx.getUsernameFromId(Id);
						desc += `\n[${username}](https://www.roblox.com/users/${person.userId}/profile)(${person.userId}) | points: ${person.points}`;
					}
					if (j === 5) {
						j = 0;
					}
					values[i + 1].setDescription(desc);
					i++;
				}
			}
			return;
		}
		await getData();

		return await pagination(bot, message, args, guild, values);
	}
	if (args.includes('--user')) {
		const arg = args[args.indexOf('--user') + 1];
		if (!arg) return message.channel.send('Please give the user you wish to find');
		if (!isNaN(arg)) {
			const user = system.users.find(one => one.userId === args[3]);
			if (!user) return message.channel.send('Could not find the user ' + args[3]);
			const username = await rbx.getUsernameFromId(user.userId);
			const userinfo = new MessageEmbed()
				.setTitle(`${username} - ${system.name}`)
				.setDescription(` ${user.points} ${system.currency}`)
				.setFooter('Origin Points');
			return message.channel.send(userinfo);
		}
		if (isNaN(arg)) {
			const userId = await rbx.getIdFromUsername(arg)
				.catch(() => {return message.channel.send('Could not find a roblox account with the username ' + arg);});
			const user = system.users.find(one => one.userId === userId);
			if (!user) return message.channel.send('Could not find the user ' + userId);
			const userinfo = new MessageEmbed()
				.setTitle(`${arg} - ${system.name}`)
				.setDescription(` ${user.points} ${system.currency}`)
				.setFooter('Origin Points');
			return message.channel.send(userinfo);
		}
	}
};