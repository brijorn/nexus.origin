const { MessageEmbed } = require('discord.js');
const embed = require('../../functions/embed');

module.exports.run = async (bot, message, args, guild) => {
	if (!args[0]) {
		const verificationCommands = [];
		const userCommands = [];
		const settingCommands = [];
		const moderationCommands = [];
		bot.cmds.forEach(command => {
			if (command.help.module === 'verification') {
				return verificationCommands.push(command.help);
			}
			if (command.help.module === 'user') {
				return userCommands.push(command.help);
			}
			if (command.help.module === 'settings') {
				return settingCommands.push(command.help);
			}
			if (command.help.module === 'moderation') {return moderationCommands.push(command.help);}
		});
		const verificationMap = verificationCommands.map(each => `\`${guild.prefix}${each.name}\` -> ${each.description}`).join('\n');
		const userMap = userCommands.map(each => `\`${guild.prefix}${each.name}\` -> ${each.description}`).join('\n');
		const settingMap = settingCommands.map(each => `\`${guild.prefix}${each.name}\` -> ${each.description}`).join('\n');
		const modMap = moderationCommands.map(each => `\`${guild.prefix}${each.name}\` -> ${each.description}`).join('\n');
		const HelpTest = new MessageEmbed()
			.setTitle('Bot Commands')
			.setDescription(`To see more information on a command run ${guild.prefix}help <command-name>`)
			.addField('Verification', verificationMap)
			.addField('User', userMap)
			.addField('Settings', settingMap)
			.addField('Moderation', modMap);
		message.channel.send('📥**Shot you a DM!**');
		message.author.send(HelpTest);
	}
	if (args[0]) {
		const input = args[0].toLowerCase();
		if (!bot.cmds.get(input)) return embed('Command Not Found', 'Could not find the given command', guild);
		const base = bot.cmds.get(input);
		const info = base.help;
		const comInfo = new MessageEmbed()
			.setTitle(info.name);
		if (!info.inDepth) {
			let desc = info.description;
			if (info.aliases) {
				const aliasmap = info.aliases.map(m => m).join('\n');
				desc = desc + '\nCommand Aliases:' + `\`${aliasmap}\``;
			}
			comInfo.setDescription(desc);
		}
		else {
			let desc = info.inDepth;
			if (info.aliases) {
				const aliasmap = info.aliases.map(m => m).join(', ');
				desc = desc + '\n\nCommand Aliases:' + `\`${aliasmap}\``;
			}
			comInfo.setDescription(desc);
		}
		if (info.syntax) {
			const synmap = info.syntax.map(e => `${e}`).join('\n');
			comInfo.addField('Syntax', `\`${info.syntax.join('\n')}\``);
		}

		if (info.cooldown) {
			comInfo.addField('Cooldown', `${info.cooldown} seconds`);
		}
		message.channel.send(comInfo);
	}
};

module.exports.help = {
	name: 'help',
	module: 'utility',
	cooldown: 5,
};