const embed = require('../../functions/embed');
const { editStartPrompt, editprompt } = require('../../prompt/index');
const { failure } = require('../../config.json');
const thedeed = require('../../lib/errors');
const userslist = require('../../functions/settingsFunctions/points/userslist');
module.exports.run = async (bot, message, args, guild) => {
	const errors = await thedeed(message, guild);
	console.log(errors.CheckFor.all() === false);
	if (errors.CheckFor.enabledMod('points', 'Points') === false) return;
	if (errors.CheckFor.all() === false) return;
	let argstat = 0;
	let editor = undefined;
	let users = undefined;
	let type = undefined;
	let system = undefined;
	let start = undefined;
	let pntamt = undefined;
	if (args[0] === 'users') {
		const userlist = require('../../functions/settingsFunctions/points/userslist');
		if (!args[1]) return message.channel.send(embed('Missing System', 'Please give the points system you wish to list the users for.', guild));
		return await userslist(bot, message, args, guild);
	}
	if (!args[0]) {
		const msg = embed('Points', `What system would you like to use?\n\`${guild.points.systems.map(each => `${each.name}`).join(', ')}\``, guild);
		const startprompt = await editStartPrompt(message, msg);
		const typeprompt = await editprompt(message, startprompt.message, embed('Points', 'Would you like to add or remove points?\n\nTip: you can also run this with points <a, r> <points-amount> <user, or user,user>', guild), 'lower');
		if (!typeprompt.includes('a') && !typeprompt.includes('r')) return message.reply('Please give a valid option.');
		const pointprompt = await editprompt(message, startprompt.message, embed('Points', 'What is the amount of points you are giving to the user(s)', guild));
		const userprompt = await editprompt(message, startprompt.message, embed('Points', 'What user(s) would you like to add points to?\nIf giving multiple, seperate with a comma.', guild));
		users = userprompt;
		type = typeprompt;
		pntamt = pointprompt;
		system = startprompt.content;
		start = startprompt.message;
	}
	if (system === undefined && guild.points.systems.find(one => one.name.toLowerCase() === args.slice(0, 2).join(' ').toLowerCase())) {
		argstat = 1;
		system = guild.points.systems.find(one => one.name.toLowerCase() === args.slice(0, 2).join(' ').toLowerCase());
	}
	else {
		system = (system === undefined) ? guild.points.systems.find(one => one.name.toLowerCase() === args[0].toLowerCase()) : guild.points.systems.find(one => one.name.toLowerCase() === system.toLowerCase());
		if (system === undefined) return message.reply('system not found');
	}
	type = (type === undefined) ? (args[argstat + 1].toLowerCase().includes('a') ? 'add' : 'remove') : type;
	if (!type.toLowerCase().includes('a') && !type.toLowerCase().includes('r')) return message.reply('Please give a valid option.');
	users = (users === undefined) ? args.slice(argstat + 3).join() : users;
	pntamt = (pntamt === undefined) ? args[argstat + 2] : pntamt;
	if (isNaN(pntamt) === true) return message.channel.send('Point amount must be a number.');
	editor = (start === undefined) ? await message.channel.send(embed('Points System', 'Please Wait..', guild)) : start;
	const addremove = require('../../functions/settingsFunctions/points/pointadd');
	pntamt = parseInt(pntamt);
	console.log('here');
	return await addremove(bot, message, args, guild, system, system.name, type, users, pntamt, editor);
};

module.exports.help = {
	name: 'point',
	module: 'user',
	aliases: ['p', 'points'],
	description: 'Add or remove points from a user in the specified system.',

};