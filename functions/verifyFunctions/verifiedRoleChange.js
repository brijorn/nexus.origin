const Discord = require('discord.js');
const config = require('../../config.json');
const editprompt = require('../../prompt/editprompt');
const embed = require('../embed');
module.exports = async (bot, message, guild, msgtoEdit) => {
	let role = undefined;
	const verifiedask = embed('Group Setup', 'What would you like the `Verified` role to be?', guild);
	const verifiedaskprompt = await editprompt(message, msgtoEdit, verifiedask);
	if (!message.guild.roles.cache.find(arole => arole.name === verifiedaskprompt)) {
		const darole = await bot.guilds.cache.get(message.guild.id).roles.create({
			data: {
				name: verifiedaskprompt,
			},
			reason: 'Nexus Origin Verification Setup',
		}).then(async darole => {
			// Updates
			guild.verificationSettings.verifiedRole = darole.id;
			guild.markModified('verificationSettings');
			await guild.save();
			role = darole.name;
		});
		return role;
	}
	if (message.guild.roles.cache.find(arole => arole.name === verifiedaskprompt)) {
		const darole = message.guild.roles.cache.find(arole => arole.name === verifiedaskprompt);
		guild.verificationSettings.verifiedRole = darole.id;
		guild.markModified('verificationSettings');
		await guild.save();
		return role = darole.name;
	}
	return role;
};