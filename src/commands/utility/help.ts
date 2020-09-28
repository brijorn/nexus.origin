/* eslint-disable @typescript-eslint/no-explicit-any */
import OriginMessage from "../../lib/extensions/OriginMessage";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";
import { GuildSettings } from "../../typings/origin";

import { MessageEmbed } from 'discord.js';
import embed from '../../functions/embed';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'help',
			description: 'View all the available commands and what they do',
			syntax: ['help', 'help <command-name>']
		})
	}

	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void> {
		if (!args[0]) {
			const verificationCommands: Command[] = [];
			const userCommands: Command[] = [];
			const settingCommands: Command[] = [];
			const moderationCommands: Command[] = [];
			this.bot.commands.forEach(command => {
				if (command.module === 'verification') {
					return verificationCommands.push(command);
				}
				if (command.module === 'user') {
					return userCommands.push(command);
				}
				if (command.module === 'settings') {
					return settingCommands.push(command);
				}
				if (command.module === 'moderation') {return moderationCommands.push(command);}
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
			const base = this.bot.commands.fetch(input);
			if (!base) {
				message.error(`Could not find the command ${input}`)
				return;
			}
			const comInfo = new MessageEmbed()
				.setTitle(base.name);
			if (!base.inDepthDescription) {
				let desc = base.description;
				if (base.aliases) {
					const aliasmap = base.aliases.map(m => m).join('\n');
					desc = desc + '\nCommand Aliases:' + `\`${aliasmap}\``;
				}
				comInfo.setDescription(desc);
			}
			else {
				let desc = base.inDepthDescription;
				if (base.aliases) {
					const aliasmap = base.aliases.map(m => m).join(', ');
					desc = desc + '\n\nCommand Aliases:' + `\`${aliasmap}\``;
				}
				comInfo.setDescription(desc);
			}
			if (base.syntax) {
				const synmap = base.syntax.map(e => `${e}`).join('\n');
				comInfo.addField('Syntax', `\`${base.syntax.join('\n')}\``);
			}
	
			if (base.cooldown) {
				comInfo.addField('Cooldown', `${base.cooldown} seconds`);
			}
			message.channel.send(comInfo);
		}
	}
}

module.exports.help = {
	name: 'help',
	module: 'utility',
	cooldown: 5,
};