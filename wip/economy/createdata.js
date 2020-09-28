const embed = require('../../functions/embed');
const moment = require('moment-timezone');
const eco = require('../../models/economy/index');
const delay = ms => new Promise(res => setTimeout(res, ms));
async function change(embed, msg) {
	await delay(1500);
	msg.edit(embed);
}
module.exports.run = async (bot, message, args, guild) => {
	if (await eco.user.findOne({ userId: message.author.id })) return message.channel.send('Fool, you are already in the database why have you come here?');
	const init = await message.channel.send(embed('none', 'I will begin to offload your data please stand by.', guild, '#ffffff', false, false));
	const init2 = embed('none', 'Hold on, I\'m retrieving your data\n⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜', guild, '#ffffff', false, false)
		.setThumbnail('https://i.imgur.com/OQ4Cox0.gif');
	await change(init2, init);

	const init3 = embed('none', `Transmitting data from ${message.author}...\n\`Id: ${message.author.id}\`\n⬛⬛⬛⬜⬜⬜⬜⬜⬜⬜`, guild, '#ffffff', false, false);
	await change(init3, init);

	const init4 = embed('none', `Transmitting data from ${message.author}...\n\`Creation Date: ${message.author.createdAt}\`\n⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜`, guild, '#ffffff', false, false);
	await change(init4, init);

	const init5 = embed('none', `Transmitting data from ${message.author}...\n\`Balance: 500\`\n⬛⬛⬛⬛⬛⬛⬛⬛⬛🟥`, guild, '#ffffff', false, false);
	await change(init5, init);

	const init6 = embed('none', `Transmitting data from ${message.author}...\n\`Balance: 0\`\n⬛🟥🟥🟥🟥🟥🟥🟥🟥🟥`, guild, '#ffffff', false, false);
	await change(init6, init);

	await eco.createUser(message.author.id);
	const init7 = embed('none', 'Alright, I\'m done, your data is created, although I did take the starting bonus as a reward for my efforts. View your empty account with `bal`.', guild, '#ffffff', false, false);
	await change(init7, init);

};

module.exports.help = {
	name: 'createdata',
	module: 'economy',
};