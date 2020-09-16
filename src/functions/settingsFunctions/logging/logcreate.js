const editStart = require('../../../prompt/editStartPrompt');
const editprompt = require('../../../prompt/editprompt');
const embed = require('../../embed');
const { set } = require('mongoose');
const editStartPrompt = require('../../../prompt/editStartPrompt');
module.exports = async (bot, message, args, guild) => {
	const log = guild.logging;
	let start = undefined;
	async function Enable(name) {
		name = name.toLowerCase();
		if (start) start.message.delete({ timeout: 0 });
		if (!avArray.includes(name)) return message.channel.send('Cancelled, Invalid Option Given.');
		if (guild.logging.settings.includes(name)) return message.channel.send('This setting is already created');
	}
	const avArray = ['ranking'];
	const enabledSetting = (log.settings.length === 0) ? 'None' : log.settings.map(e => { if (e.enabled === true) return `${e}`; });
	const available = avArray.filter(function(val) {
		return enabledSetting.indexOf(val) == -1;
	});
	const avList = available.map(e => `${e}`).join(', ');
	if (!args[2]) {
		const msg = embed('Logging Enable', `Which setting would you like to enable?\nAvailable: \`${avList}\``, guild);
		start = await editStartPrompt(message, msg);
		return await Enable(start.content);
	}
};