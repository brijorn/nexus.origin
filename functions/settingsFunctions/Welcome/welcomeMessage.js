const formats = require('./welcomeformats.json');
const embed = require('../../embed');
const editprompt = require('../../../prompt/editprompt');
const config = require('../../../config.json');

module.exports = async (bot, message, args, guild, msgToEdit) => {
	const desc = formats.formats.map(each => `${each.name} -> ${each.description}`).join('\n\n');
	const note = '\nThese formats can be accompanied with other text, eg: \`{user} has joined {guild.name}! Membercount: {membercount}\`';
	const cancelmsg = '\n\nRespond **cancel** to cancel.';
	const askmsg = embed('Message Configuration', `What would you like to set the welcome message to?\n**Available Templates:**\`\`\`\n${desc}\`\`\`${note}${cancelmsg}`, guild, '#');
	const ask = await editprompt(message, msgToEdit, askmsg);
	if (ask === 'cancel') {
		await msgToEdit.delete({ timeout: 50 });
		return message.channel.send('Cancelled.');
	}
	guild.welcome.message = ask;
	guild.markModified('welcome');
	await guild.save();
	msgToEdit.edit(embed('Value Changed', 'The welcome message has successfully been changed to ' + ask, guild, config.success));
};