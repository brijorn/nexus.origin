const Discord = require('discord.js');
const guildModel = require('../../models/guildModel/guild');
const { enabled, disabled, failure } = require('../../config.json');
const embed = require('../../functions/embed');
module.exports.run = async (bot, message, args, db) => {
	if (message.author.id !== message.guild.ownerID && !guild.permissions.owners.includes(message.author.id)) return message.reply(embed('Permissions', 'You need to be the guild owner or have owner permission to be able to view the guild\'s settings', guild, failure));
	if (!args.length) {
		const settingspage = require('../../functions/settingsFunctions/settingspage');
		await settingspage(bot, message, args, db);
	}
	if (!args[0]) return;
	// The Heart
	if (args[0].startsWith('mod')) {
		const modmenu = require('../../functions/settingsFunctions/moderation/modmenu');
		return await modmenu(bot, message, args, db);
	}
	if (args[0].startsWith('log')) {
		const logmenu = require('../../functions/settingsFunctions/logging/logmenu');
		return await logmenu(bot, message, args, db);
	}
	if (args[0] === 'suggestions') {
		const suggestion = require('../../functions/settingsFunctions/suggestion');
		await suggestion(bot, message, args, db);
	}
	if (args[0] === 'embed') {
		const embedconfig = require('../../functions/settingsFunctions/embedconfig');
		await embedconfig(bot, message, args, db);
	}
	if (args[0] === 'permissions') {
		const permission = require('../../functions/settingsFunctions/permissions');
		await permission(bot, message, args, db);
	}
	if (args[0].startsWith('veri')) {
		const verification = require('../../functions/settingsFunctions/verifSettings/verificationSettings');
		await verification(bot, message, args, db);
	}
	if (args[0].startsWith('welc')) {
		const welcome = require('../../functions/settingsFunctions/Welcome/welcomemenu');
		await welcome(bot, message, args, db);
	}
	if (args[0].startsWith('app')) {
		const applicationmenu = require('../../functions/settingsFunctions/Application/appmenu');
		await applicationmenu(bot, message, args, db);
	}
	if (args[0].startsWith('point')) {
		const pointsmenu = require('../../functions/settingsFunctions/points/pointsmenu');
		await pointsmenu(bot, message, args, db);
	}
	if (args[0].startsWith('pre')) {
		const prefixset = require('../../functions/settingsFunctions/prefix');
		await prefixset(bot, message, args, db);
	}

};

module.exports.help = {
	name: 'settings',
	module: 'settings',
	aliases: ['setting', 's'],
	description: 'Shows all settings for the given guild',
};