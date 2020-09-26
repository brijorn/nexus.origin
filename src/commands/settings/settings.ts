import OriginMessage from "../../lib/extensions/OriginMessage";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";
import { Message } from "discord.js";
import { RegularEmbed } from "../../functions/embed";
import { GuildSettings } from "../../typings/origin";
// Modules
import suggestion from '../../plugins/suggestion/settings';
/*
import modmenu from '../../functions/settingsFunctions/moderation/modmenu';
import logmenu from '../../functions/settingsFunctions/logging/logmenu';
import embedconfig from '../../functions/settingsFunctions/embedconfig';
import permission from '../../functions/settingsFunctions/permissions';
import verification from '../../functions/settingsFunctions/verification/verificationSettings';
import welcome from '../../functions/settingsFunctions/Welcome/welcomemenu';
import applicationmenu from '../../functions/settingsFunctions/Application/appmenu';
import pointsmenu from '../../functions/settingsFunctions/points/pointsmenu';
import prefixset from '../../functions/settingsFunctions/prefix';
*/
export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'suggest',
			description: 'View the settings of your guild',
			syntax: ['!settings']
		})
	}
	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void|Message> {
		if (message.author.id !== message.guild?.ownerID) return message.reply(RegularEmbed({title: 'Permissions', description: 'You need to be the guild owner or have owner permission to be able to view the guild\'s settings' }));
		if (!args[0]) return;
		// The Heart
		if (args[0].startsWith('mod')) {
			// return await modmenu(this.bot, message, args);
		}
		if (args[0].startsWith('log')) {
			// return await logmenu(this.bot, message, args);
		}
		if (args[0] === 'suggestions') {
			await suggestion(this.bot, message, guild, args);
		}
		if (args[0] === 'embed') {
			// await embedconfig(this.bot, message, args)
		}
		if (args[0] === 'permissions') {
			// await permission(this.bot, message, args);
		}
		if (args[0].startsWith('veri')) {
			// await verification(this.bot, message, args);
		}
		if (args[0].startsWith('welc')) {
			// await welcome(this.bot, message, args);
		}
		if (args[0].startsWith('app')) {
			// await applicationmenu(this.bot, message, args);
		}
		if (args[0].startsWith('point')) {
			// await pointsmenu(this.bot, message, args);
		}
		if (args[0].startsWith('pre')) {
			// await prefixset(this.bot, message, args, db);
		}
	}
}

module.exports.help = {
	name: 'settings',
	module: 'settings',
	aliases: ['setting', 's'],
	description: 'Shows all settings for the given guild',
};