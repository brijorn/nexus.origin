const { initShop, shop } = require('../../models/economy/index');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, guild) => {
	if (message.author.id !== '452913357276577803') return message.channel.send('Unauthorized..');

	const modify = args[0];

	if (modify === 'shop') {

		await initShop(args[1]);
		message.channel.send('Successful.');
	}
	if (modify === 'item') {
		const type = args[1];
		if (type === 'game') {
			const job = args[2];
			let info = args.splice(3).join(' ');
			info = info.split(':');
			const gameObj = {
				type: info[0],
				msg: info[1],
				res: info[2],
			};
			const data = await shop.findOne({ name: 'Jobs' });
			const jobdata = data.data.find(o => o.name.toLowerCase() === job.toLowerCase());
			jobdata.games.push(gameObj);
			data.markModified('data');
			await data.save();
			message.channel.send('Game Successfully added.');
		}

		if (type === 'Job') {
			const data = await shop.findOne({ name: 'Jobs' });
			const arr = data.data;

			// Splice Name

			const quoteStart = args.find(o => o.startsWith('\'')); const quoteEnd = args.find(o => o.endsWith('\''));
			const startIndex = args.indexOf(quoteStart); const endIndex = args.indexOf(quoteEnd);
			let name = args.splice(startIndex, endIndex - 1);
			name = name.join(' ');
			name = name.replace('\'', '');name = name.replace('\'', '');
			if (arr.find(j => j.name === name)) return message.channel.send('Job already exists.');
			// Splice Description

			const quoteStartA = args.find(o => o.startsWith('\'')); const quoteEndB = args.find(o => o.endsWith('\''));
			const startIndexA = args.indexOf(quoteStartA); const endIndexB = args.indexOf(quoteEndB);
			let desc = args.splice(startIndexA, endIndexB - 1);
			desc = desc.join(' ');
			desc = desc.replace('\'', '');desc = desc.replace('\'', '');

			const requiredLevel = args[2];
			const salary = args[3];
			const jobObj = {
				enabled: true,
				name: name,
				desc: desc,
				salary: salary,
				required: requiredLevel,
				games: [],
			};
			arr.push(jobObj);
			data.markModified('data');
			await data.save();
			const finished = new MessageEmbed()
				.setTitle('Job successfully added')
				.setDescription('Details Below.')
				.addField('Name', jobObj.name, true)
				.addField('Description', jobObj.desc, true)
				.addField('Salary', jobObj.salary, true)
				.addField('Required Level', jobObj.required, true)
				.addField('Enabled', 'True', true);
			message.channel.send(finished);
		}
	}

};

module.exports.help = {
	name: 'generate',
	aliases: ['gen'],

};