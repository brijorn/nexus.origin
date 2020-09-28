const { MessageEmbed } = require('discord.js');
const economy = require('../../models/economy/index');

module.exports.run = async (bot, message, args, guild, user) => {
	if (user.job.name === 'Unemployed' && !args[0]) {
		const unemployed = new MessageEmbed()
			.setDescription('You are currently unemployed, you can view all the jobs available in the nexus with `work list`')
			.setFooter('You poor soul.');
		message.channel.send(unemployed);
	}
	if (!args[0] && user.job.name !== 'Unemployed') {
		await economy.job.games(message, user, user.job.name);
	}
	if (args[0] === 'list') {
		const pages = await list(user);
		if (args[1]) {
			if (isNaN(args[0]) === true) return message.channel.send('The page must be a number');
			if (!pages[args[0]]) return message.channel.send('Page does not exist');
			page = pages[args[0]];
			page.setFooter(`Page ${pages.indexOf(page)} / ${pages.length - 1}`);
			message.channel.send(page);
		}
		else {
			page = pages[1];
			page.setFooter(`Page ${pages.indexOf(page)} / ${pages.length - 1}`);
			message.channel.send(page);
		}
	}
	if (args[0] === 'apply') {
		const jobName = (args.length > 1) ? args.slice(1).join(' ') : args[1];
		return await economy.job.giveJob(message, user, jobName);
	}
	if (args[0] === 'quit') {
		return await economy.job.quitJob(message, user);
	}
};
module.exports.help = {
	'name': 'work',
	aliases: ['job'],
	syntax: ['!work'],
	module: 'economy',
	description: 'Work for money at your job',
	cooldown: '5',
};

async function list(user) {
	const itemlist = await economy.shop.findOne({ name: 'Jobs' });
	const pages = ['filler'];
	let j = 0;
	let u = 0;

	for (i = 0;i < itemlist.data.length; i++) {
		if (j < 5) {
			pages[i + 1] = new MessageEmbed()
				.setTitle('Jobs List');
			let desc = 'To see more pages use `shop [page-number]\n`';
			for (;u < itemlist.data.length && j < 5; u++) {
				j++;
				const item = itemlist.data[u];
				if (item.enabled === false) return;
				const lock = (user.levelling.level >= desc.required) ? '🔓' : '🔒';
				desc += `\n**${item.name}**\n${item.desc}\nSalary: ${economy.coin}**${item.salary}**`;
			}
			if (j === 5) {
				j = 0;
			}
			pages[i + 1].setDescription(desc);
			i++;
		}
	}
	return pages;
}